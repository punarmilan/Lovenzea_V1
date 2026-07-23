package com.punarmilan.service;

import com.punarmilan.dto.AdminLoginRequest;
import com.punarmilan.dto.AdminResponse;

public interface AdminAuthService {
    AdminResponse login(AdminLoginRequest request);
}
