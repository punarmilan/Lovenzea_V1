package com.punarmilan.service.impl;

import com.punarmilan.service.MinioService;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@RequiredArgsConstructor
@Slf4j
public class MinioServiceImpl implements MinioService {

    private final MinioClient minioClient;

    @Value("${minio.bucket-name:punarmilan-photos}")
    private String bucketName;

    @Value("${minio.public-url:}")
    private String publicUrl;

    @Value("${minio.enabled:true}")
    private boolean minioEnabled;

    @jakarta.annotation.PostConstruct
    public void init() {
        if (!minioEnabled) {
            log.info("MinIO is disabled in configuration. Skipping bucket initialization.");
            return;
        }
        try {
            boolean found = minioClient.bucketExists(io.minio.BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {
                log.info("Creating bucket: {}", bucketName);
                minioClient.makeBucket(io.minio.MakeBucketArgs.builder().bucket(bucketName).build());
            } else {
                log.info("Bucket {} already exists", bucketName);
            }
        } catch (Exception e) {
            log.error("Error initializing MinIO bucket: {}", e.getMessage());
        }
    }

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        try {
            String fileName = folder + "/" + UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

            if (!minioEnabled) {
                Path uploadPath = Paths.get("uploads", fileName);
                Files.createDirectories(uploadPath.getParent());
                Files.copy(file.getInputStream(), uploadPath, StandardCopyOption.REPLACE_EXISTING);
                return fileName;
            }

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build());

            // Return ONLY the object name/path, not the presigned URL
            return fileName;

        } catch (Exception e) {
            log.error("Error uploading file to MinIO: {}", e.getMessage());
            throw new com.punarmilan.exception.BadRequestException("Could not upload file: " + e.getMessage());
        }
    }

    @Override
    public String getPresignedUrl(String objectName) {
        if (objectName == null || objectName.isEmpty()) {
            return null;
        }

        String actualObject = objectName;
        // If it looks like a full URL (legacy data), extract the actual object path
        if (objectName.contains("/" + bucketName + "/")) {
            try {
                // handle case where it might be a full URL with bucket name
                int index = objectName.indexOf("/" + bucketName + "/");
                actualObject = objectName.substring(index + ("/" + bucketName + "/").length());
                // Remove query parameters if any (expiry/signature)
                if (actualObject.contains("?")) {
                    actualObject = actualObject.substring(0, actualObject.indexOf("?"));
                }
                log.debug("Extracted legacy object path: {} from URL: {}", actualObject, objectName);
            } catch (Exception e) {
                log.warn("Failed to parse legacy URL for presigned generation: {}", objectName);
            }
        }

        if (!minioEnabled) {
            try {
                String baseUrl = org.springframework.web.servlet.support.ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .build()
                        .toUriString();
                return baseUrl + "/uploads/" + actualObject;
            } catch (Exception e) {
                return "http://localhost:8085/uploads/" + actualObject;
            }
        }

        // If a public URL is configured, return the direct URL since the bucket is public anyway.
        // This avoids Host/Path mismatch errors in AWS signatures behind a proxy.
        if (publicUrl != null && !publicUrl.isEmpty()) {
            String baseUrl = publicUrl.endsWith("/") ? publicUrl.substring(0, publicUrl.length() - 1) : publicUrl;
            String path = actualObject.startsWith("/") ? actualObject.substring(1) : actualObject;
            String url = baseUrl + "/" + path;
            log.debug("Returning direct public URL: {}", url);
            return url;
        }

        try {
            String url = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(actualObject)
                            .expiry(7, TimeUnit.DAYS)
                            .build());
            
            return url;
        } catch (Exception e) {
            log.error("Error generating presigned URL for {}: {}", objectName, e.getMessage());
            return null;
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }

        try {
            String objectName = fileUrl;
            // Handle legacy URLs: extract path if it's a full URL
            if (fileUrl.contains(bucketName + "/")) {
                objectName = fileUrl.substring(fileUrl.indexOf(bucketName + "/") + bucketName.length() + 1);
                // Remove query parameters if any
                if (objectName.contains("?")) {
                    objectName = objectName.substring(0, objectName.indexOf("?"));
                }
            }

            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build());
        } catch (Exception e) {
            log.error("Error deleting file from MinIO: {}", e.getMessage());
        }
    }
}
