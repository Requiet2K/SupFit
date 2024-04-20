package com.project.supplement.service.impl;

import com.luciad.imageio.webp.WebPReadParam;
import com.project.supplement.dto.request.productDTO;
import com.project.supplement.dto.response.productResponse;
import com.project.supplement.entity.Category;
import com.project.supplement.entity.Flavour;
import com.project.supplement.entity.NutritionFacts;
import com.project.supplement.entity.Product;
import com.project.supplement.exception.custom_exceptions.InvalidCategoryIdException;
import com.project.supplement.exception.custom_exceptions.ProductNotExistsException;
import com.project.supplement.repository.CategoryRepository;
import com.project.supplement.repository.FlavourRepository;
import com.project.supplement.repository.ProductRepository;
import com.project.supplement.service.ProductService;
import io.trbl.blurhash.BlurHash;
import jakarta.annotation.PostConstruct;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService{
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final FlavourRepository flavourRepository;
    private final ModelMapper modelMapper;

    public ProductServiceImpl(ProductRepository productRepository, ModelMapper modelMapper, CategoryRepository categoryRepository, FlavourRepository flavourRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.modelMapper = modelMapper;
        this.flavourRepository = flavourRepository;
    }

    @Override
    public void createProduct(productDTO productRequest) {

        Product product = modelMapper.map(productRequest, Product.class);

        List<NutritionFacts> nutritionFactsList = productRequest.getNutritionFacts().entrySet().stream()
                .map(entry -> {
                    NutritionFacts nutritionFacts = new NutritionFacts();
                    nutritionFacts.setNutrientName(entry.getKey());
                    nutritionFacts.setAmount(entry.getValue());
                    nutritionFacts.setProduct(product);
                    return nutritionFacts;
                })
                .collect(Collectors.toList());

        product.setNutritionFacts(nutritionFactsList);

        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(InvalidCategoryIdException::new);

        product.setCategory(category);

        String imageUrl = productRequest.getImageUrl();

        try {
            URL url = new URL(imageUrl);
            InputStream inputStream = url.openStream();

            ImageReader reader = ImageIO.getImageReadersByMIMEType("image/webp").next();

            WebPReadParam readParam = new WebPReadParam();
            readParam.setBypassFiltering(true);

            reader.setInput(ImageIO.createImageInputStream(inputStream));

            BufferedImage image = reader.read(0, readParam);

            if (image == null) {
                System.out.println("Invalid image: " + imageUrl);
            } else {
                String blurHash = BlurHash.encode(image);
                if (blurHash == null) {
                    System.out.println("Could not generate BlurHash for image: " + imageUrl);
                } else {
                    product.setBlurhashImg(blurHash);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        List<Flavour> flavours = flavourRepository.findAllById(productRequest.getFlavourIds());

        if(flavours == null){
            throw new InvalidCategoryIdException();
        }

        product.setFlavours(flavours);

        productRepository.save(product);
    }

    public List<productResponse> getProductsByCategory(Long categoryId){

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(InvalidCategoryIdException::new);

        List<Product> products;

        if(categoryId == 6){
            products = productRepository.findAll();
        }else{
            products = productRepository.findAllByCategoryId(categoryId);
        }

        return products.stream()
                .map(product -> {

                    productResponse productResponse = modelMapper.map(product, productResponse.class);

                    productResponse.setNutritionFacts(product.getNutritionFacts().stream()
                            .collect(Collectors.toMap(NutritionFacts::getNutrientName, NutritionFacts::getAmount)));
                    productResponse.setCategoryName(product.getCategory().getName());

                    Map<String, String> flavourMap = new HashMap<>();
                    for (Flavour flavour : product.getFlavours()) {
                        flavourMap.put(flavour.getName(), flavour.getColor());
                    }

                    productResponse.setFlavours(flavourMap);

                    return productResponse;

                })
                .collect(Collectors.toList());
    }

    public List<String> getAllProductsName(){
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(Product::getName)
                .collect(Collectors.toList());
    }

    public productResponse findProductByPathName(String pathName){
        String[] parts = pathName.split("-");
        String output = "";
        for (int i = 0; i < parts.length; i++) {
            String part = parts[i];
            output += Character.toUpperCase(part.charAt(0)) + part.substring(1);
            if (i < parts.length - 1) {
                output += " ";
            }
        }

        Product productOptional = productRepository.findByName(output)
                .orElseThrow(ProductNotExistsException::new);

        productResponse productResponse = modelMapper.map(productOptional, productResponse.class);
        productResponse.setCategoryName(productOptional.getCategory().getName());
        productResponse.setNutritionFacts(productOptional.getNutritionFacts().stream()
                .collect(Collectors.toMap(NutritionFacts::getNutrientName, NutritionFacts::getAmount)));

        Map<String, String> flavourMap = new HashMap<>();
        for (Flavour flavour : productOptional.getFlavours()) {
            flavourMap.put(flavour.getName(), flavour.getColor());
        }

        productResponse.setFlavours(flavourMap);

        return productResponse;
    }

    //If images are added manually from the database, this function will generate hashed img strings for null blashedImgs
    @PostConstruct
    public void checkForBlurhashImgs(){
        List<Product> products = productRepository.findAll();

        products.stream()
                .forEach(product -> {
                    if(product.getBlurhashImg() == null){

                        String imageUrl = product.getImageUrl();

                        try {
                            URL url = new URL(imageUrl);
                            InputStream inputStream = url.openStream();

                            ImageReader reader = ImageIO.getImageReadersByMIMEType("image/webp").next();

                            WebPReadParam readParam = new WebPReadParam();
                            readParam.setBypassFiltering(true);

                            reader.setInput(ImageIO.createImageInputStream(inputStream));

                            BufferedImage image = reader.read(0, readParam);

                            if (image == null) {
                                System.out.println("Invalid image: " + imageUrl);
                            } else {
                                String blurHash = BlurHash.encode(image);
                                product.setBlurhashImg(blurHash);
                                productRepository.save(product);
                            }
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                });
    }

    public void deleteProduct(Long productId){
        Optional<Product> product = productRepository.findById(productId);
        product.ifPresentOrElse(productRepository::delete,
                ProductNotExistsException::new
        );
    }
}
