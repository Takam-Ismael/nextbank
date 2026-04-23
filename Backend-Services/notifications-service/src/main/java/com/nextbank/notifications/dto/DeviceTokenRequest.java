package com.nextbank.notifications.dto;

import com.nextbank.notifications.entity.DeviceToken.DeviceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceTokenRequest {
    private String deviceToken;
    private DeviceType deviceType;
}
