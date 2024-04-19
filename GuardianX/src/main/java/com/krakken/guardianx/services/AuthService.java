package com.krakken.guardianx.services;

import com.krakken.guardianx.models.User;
import com.krakken.guardianx.models.dto.UserEmailLoginDto;
import com.krakken.guardianx.models.dto.UserPhoneLoginDto;
import com.krakken.guardianx.models.dto.UserRegistrationDto;

public interface AuthService {
    User loginUserByPhone(UserPhoneLoginDto userPhoneLoginDto);
    User loginUserByEmail(UserEmailLoginDto userEmailLoginDto);
    String registerUser(UserRegistrationDto userRegistrationDto);

}
