package com.project.supplement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SupplementApplication {

	public static void main(String[] args) {
		SpringApplication.run(SupplementApplication.class, args);
	}


}
