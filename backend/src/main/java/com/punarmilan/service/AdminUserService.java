package com.punarmilan.service;

import com.punarmilan.dto.AdminUserDetailDTO;
import com.punarmilan.dto.AdminUserSearchCriteria;
import com.punarmilan.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminUserService {
    Page<User> getAllUsers(AdminUserSearchCriteria criteria, Pageable pageable);

    AdminUserDetailDTO getUserById(Long userId);

    void blockUser(Long userId);

    void unblockUser(Long userId);

    void deleteUser(Long userId);
}
