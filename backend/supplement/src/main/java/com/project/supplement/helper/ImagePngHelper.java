package com.project.supplement.helper;

import io.trbl.blurhash.BlurHash;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public class ImagePngHelper {
    public static String generateBlurHash(String imageUrl) {
        try {
            URL url = new URL(imageUrl);
            InputStream inputStream = url.openStream();

            BufferedImage image = ImageIO.read(inputStream);

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
