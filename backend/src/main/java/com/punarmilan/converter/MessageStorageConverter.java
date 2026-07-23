package com.punarmilan.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

@Converter
@Component
@Slf4j
public class MessageStorageConverter implements AttributeConverter<String, String> {

    private static String encryptionKey;

    @Value("${chat.encryption.key:Puna@Milan#2024SecureKey32Chars!}")
    public void setEncryptionKey(String key) {
        MessageStorageConverter.encryptionKey = key;
    }

    private static final String ALGORITHM = "AES";

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null || attribute.isEmpty())
            return attribute;
        try {
            // 1. GZIP Compress
            byte[] compressed = compress(attribute);

            // 2. AES Encrypt
            byte[] encrypted = encrypt(compressed);

            // 3. Base64 Encode for storage
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            log.error("Error encrypting/compressing message: {}", e.getMessage());
            return attribute; // Fallback to plain text if error (safety)
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty())
            return dbData;
        try {
            // 1. Base64 Decode
            byte[] decoded = Base64.getDecoder().decode(dbData);

            // 2. AES Decrypt
            byte[] decrypted = decrypt(decoded);

            // 3. GZIP Decompress
            return decompress(decrypted);
        } catch (Exception e) {
            log.warn("Could not decrypt/decompress message (might be plain text): {}", e.getMessage());
            return dbData; // Return as is if it's not encrypted (for migration/fallback)
        }
    }

    private byte[] compress(String str) throws Exception {
        ByteArrayOutputStream obj = new ByteArrayOutputStream();
        GZIPOutputStream gzip = new GZIPOutputStream(obj);
        gzip.write(str.getBytes(StandardCharsets.UTF_8));
        gzip.close();
        return obj.toByteArray();
    }

    private String decompress(byte[] bytes) throws Exception {
        GZIPInputStream gis = new GZIPInputStream(new ByteArrayInputStream(bytes));
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int len;
        while ((len = gis.read(buffer)) != -1) {
            baos.write(buffer, 0, len);
        }
        return baos.toString(StandardCharsets.UTF_8);
    }

    private SecretKeySpec getSecretKeySpec() throws Exception {
        java.security.MessageDigest sha = java.security.MessageDigest.getInstance("SHA-256");
        byte[] key = sha.digest(encryptionKey.getBytes(StandardCharsets.UTF_8));
        return new SecretKeySpec(key, ALGORITHM);
    }

    private byte[] encrypt(byte[] data) throws Exception {
        SecretKeySpec secretKey = getSecretKeySpec();
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        return cipher.doFinal(data);
    }

    private byte[] decrypt(byte[] encryptedData) throws Exception {
        SecretKeySpec secretKey = getSecretKeySpec();
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        return cipher.doFinal(encryptedData);
    }
}
