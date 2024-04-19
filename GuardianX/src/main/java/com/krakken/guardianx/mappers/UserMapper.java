package com.krakken.guardianx.mappers;

import com.amazonaws.util.StringUtils;
import com.krakken.guardianx.models.User;
import com.krakken.guardianx.models.dto.UserRegistrationDto;

public class UserMapper {
    public static User mapUserFromUserRegistrationDetails(UserRegistrationDto userRegistrationDto) {

        User user = new User();

        if (!StringUtils.isNullOrEmpty(userRegistrationDto.getName())) {
            user.setFullName(userRegistrationDto.getName());
        }

        if (!StringUtils.isNullOrEmpty(userRegistrationDto.getPhoneNumber())) {
            user.setPhoneNumber(userRegistrationDto.getPhoneNumber());
        }

        if (!StringUtils.isNullOrEmpty(userRegistrationDto.getEmail())) {
            user.setEmail(userRegistrationDto.getEmail());
        }
        return user;
    }
}
