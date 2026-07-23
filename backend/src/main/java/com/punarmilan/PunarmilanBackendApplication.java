package com.punarmilan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableAsync
@org.springframework.scheduling.annotation.EnableScheduling
@org.springframework.cache.annotation.EnableCaching
@org.springframework.data.jpa.repository.config.EnableJpaRepositories(basePackages = "com.punarmilan.repository")
@org.springframework.data.redis.repository.configuration.EnableRedisRepositories(basePackages = "com.punarmilan.redis.repository") // Assuming you might add them here later, or just keep it empty
public class PunarmilanBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PunarmilanBackendApplication.class, args);

		System.err.println("punarmilan backend application started successfully");

	}

}
