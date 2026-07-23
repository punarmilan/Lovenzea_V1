package com.punarmilan.dto;

import com.punarmilan.entity.User;
import com.punarmilan.entity.UserSubscription;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserDetailDTO {
    private User user;
    private UserSubscription activeSubscription;
}
