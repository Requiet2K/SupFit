package com.project.supplement.helper;

import com.luciad.imageio.webp.WebPReadParam;
import io.trbl.blurhash.BlurHash;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public class ImageHelper {

    public static String generateBlurHash(String imageUrl) {
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
                return null;
            } else {
                String blurHash = BlurHash.encode(image);
                if (blurHash == null) {
                    System.out.println("Could not generate BlurHash for image: " + imageUrl);
                    return null;
                } else {
                    return blurHash;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
