package com.punarmilan.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.IOException;
import java.net.Socket;

@Configuration
@Slf4j
public class MinioAutoStarter {

    @Value("${minio.exe-path:C:\\Users\\Admin\\Downloads\\minio.exe}")
    private String minioExePath;

    @Value("${minio.data-path:C:\\minio_data}")
    private String minioDataPath;

    @Value("${minio.url:http://localhost:9000}")
    private String minioUrl;

    @Value("${minio.access-key}")
    private String minioAccessKey;

    @Value("${minio.secret-key}")
    private String minioSecretKey;

    @Value("${minio.enabled:true}")
    private boolean minioEnabled;

    @PostConstruct
    public void init() {
        if (!minioEnabled) {
            log.info("MinIO is disabled in configuration. Skipping auto-start.");
            return;
        }
        if (isMinioRunning()) {
            log.info("MinIO server is already running. Skipping auto-start.");
            return;
        }
        startMinio();
    }

    private boolean isMinioRunning() {
        try {
            java.net.URL url = java.net.URI.create(minioUrl).toURL();
            String host = url.getHost();
            int port = url.getPort() != -1 ? url.getPort() : 9000;
            try (Socket socket = new Socket(host, port)) {
                return true;
            }
        } catch (IOException e) {
            return false;
        }
    }

    public void startMinio() {
        log.info("Attempting to start MinIO server automatically...");

        File exeFile = new File(minioExePath);
        if (!exeFile.exists()) {
            log.error("MinIO executable not found at: {}. Please check your application.properties", minioExePath);
            return;
        }

        File dataDir = new File(minioDataPath);
        if (!dataDir.exists()) {
            log.info("Creating MinIO data directory: {}", minioDataPath);
            dataDir.mkdirs();
        }

        ProcessBuilder pb = new ProcessBuilder(
                minioExePath,
                "server",
                minioDataPath,
                "--address",
                ":9000",
                "--console-address",
                ":9001");

        // Set environment variables for MinIO credentials
        pb.environment().put("MINIO_ROOT_USER", minioAccessKey);
        pb.environment().put("MINIO_ROOT_PASSWORD", minioSecretKey);

        // Redirect output to avoid blocking
        pb.inheritIO();

        try {
            pb.start();
            log.info("MinIO server started successfully at {} with custom credentials", minioExePath);
        } catch (IOException e) {
            log.error("Failed to start MinIO server: {}", e.getMessage());
        }
    }
}
