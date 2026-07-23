package com.punarmilan.service;

import org.springframework.web.multipart.MultipartFile;

public interface MinioService {
    String uploadFile(MultipartFile file, String folder);

    String getPresignedUrl(String objectName);

    void deleteFile(String fileUrl);
}
