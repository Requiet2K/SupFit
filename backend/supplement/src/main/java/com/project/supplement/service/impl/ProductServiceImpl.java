package com.project.supplement.service.impl;

import com.project.supplement.exception.custom_exceptions.InvalidIdException;
import com.project.supplement.exception.custom_exceptions.NotExistsException;
import com.project.supplement.helper.ImagePngHelper;
import com.project.supplement.mapper.ProductMapper;
import com.project.supplement.dto.request.productDTO;
import com.project.supplement.dto.response.productResponse;
import com.project.supplement.entity.Category;
import com.project.supplement.entity.Flavour;
import com.project.supplement.entity.Product;
import com.project.supplement.repository.CategoryRepository;
import com.project.supplement.repository.FlavourRepository;
import com.project.supplement.repository.ProductRepository;
import com.project.supplement.service.ProductService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService{
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final FlavourRepository flavourRepository;
    private final ProductMapper productMapper;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository,
                              FlavourRepository flavourRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.flavourRepository = flavourRepository;
        this.productMapper = productMapper;
    }

    @Override
    public void create(productDTO productRequest) {

        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new InvalidIdException("Invalid category id!" + productRequest.getCategoryId()));

        List<Flavour> flavours = flavourRepository.findAllById(productRequest.getFlavourIds());

        Product product = productMapper.toProductEntity(productRequest, category, flavours);

        String imageUrl = productRequest.getImageUrl();
        String blurHash = ImagePngHelper.generateBlurHash(imageUrl);

        product.setBlurhashImg(blurHash);

        productRepository.save(product);
    }

    public List<productResponse> findByCategoryId(Long categoryId){

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new InvalidIdException("Invalid category id!" + categoryId));

        List<Product> products;

        if(categoryId == 6){
            products = productRepository.findAll();
        }else{
            products = productRepository.findAllByCategoryId(categoryId);
        }

        return products.stream()
                .map(productMapper::toProductResponse)
                .collect(Collectors.toList());
    }

    public List<String> getAllNames(){
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
                .orElseThrow(() -> new NotExistsException("Product not exists!"));

        return productMapper.toProductResponse(productOptional);
    }

    //If images are added manually from the database, this function will generate hashed img strings for null blashedImgs
    @PostConstruct
    public void checkForBlurhashImgs(){
        List<Product> products = productRepository.findAll();

        products.stream()
                .forEach(product -> {
                    if(product.getBlurhashImg() == null){
                        String imageUrl = product.getImageUrl();
                        String blurHash = ImagePngHelper.generateBlurHash(imageUrl);
                        product.setBlurhashImg(blurHash);
                        productRepository.save(product);
                    }
                });
    }

    public void delete(Long productId) {
        Optional<Product> product = productRepository.findById(productId);
        product.ifPresentOrElse(productRepository::delete, () -> {
            throw new NotExistsException("Product not exists! " + productId);
        });
    }


    public productResponse findById(Long productId){
        Optional<Product> product = productRepository.findById(productId);
        if(product.isPresent()){
            return productMapper.toProductResponse(product.get());
        }else{
            throw new NotExistsException("Product not exists! "+productId);
        }
    }

    @Override
    public List<productResponse> findByInput(String input) {
        List<Product> products = productRepository.findAll();
        List<productResponse> result = new ArrayList<>();
        for(Product p : products){
            if(p.getName().toLowerCase().contains(input.toLowerCase())){
                productResponse productResponse = productMapper.toProductResponse(p);
                result.add(productResponse);
            }
        }
        return result;
    }

    @Override
    public void reStock() {
        List<Product> products = productRepository.findAll();
        products.forEach(product -> {
            product.setQuantity(100);
            productRepository.save(product);
        });
    }

}
