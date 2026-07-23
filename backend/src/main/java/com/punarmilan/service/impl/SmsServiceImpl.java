package com.punarmilan.service.impl;

import com.punarmilan.service.SmsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@Slf4j
public class SmsServiceImpl implements SmsService {

    @Value("${sms.api.url}")
    private String apiUrl;

    @Value("${sms.api.key}")
    private String apiKey;

    @Value("${sms.username}")
    private String username;

    @Value("${sms.password}")
    private String password;

    @Value("${sms.sender.id}")
    private String senderId;

    @Value("${sms.template.id}")
    private String templateId;

    private final RestTemplate restTemplate;

    public SmsServiceImpl() {
        this.restTemplate = new RestTemplate();
    }

   @Override
public void sendOtpSms(String mobileNumber, String otp) {
    log.info("Sending OTP to: {}", mobileNumber);

    try {
        String formattedNumber = mobileNumber.replaceAll("\\D", "");

        if (formattedNumber.length() == 10) {
            formattedNumber = "91" + formattedNumber;
        }

        String message = "Your Punarmilan login OTP is " + otp +
                ". Please do not share this OTP with anyone. Powered by Worknai. - Punarmilan";

        log.info("Final Mobile Number: {}", formattedNumber);
        log.info("Readable SMS Body: {}", message);
        log.info("Template ID: {}", templateId);
        log.info("Sender ID: {}", senderId);

        String encodedMsg = java.net.URLEncoder.encode(message, "UTF-8");
        String finalUrl = apiUrl
                + "?mobile=" + username
                + "&pass=" + password
                + "&senderid=" + senderId
                + "&to=" + formattedNumber
                + "&msg=" + encodedMsg
                + "&templateid=" + templateId
                + "&apikey=" + (apiKey != null ? apiKey : "");

        log.info("Final Dreamz SMS URL: {}", finalUrl);

        String response = restTemplate.getForObject(finalUrl, String.class);

        log.info("Dreamz Provider Response: {}", response);

        if (response == null ||
                response.toLowerCase().contains("error") ||
                response.toLowerCase().contains("invalid")) {
            throw new com.punarmilan.exception.BadRequestException("SMS Provider Error: " + response);
        }

    } catch (com.punarmilan.exception.BadRequestException bre) {
        throw bre;
    } catch (Exception e) {
        log.error("Failed to send SMS to {}: {}", mobileNumber, e.getMessage());
        throw new com.punarmilan.exception.BadRequestException("SMS Provider Failure: " + e.getMessage());
    }
}
}
