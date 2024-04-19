package com.krakken.guardianx.services.impl;

import com.amazonaws.util.StringUtils;
import com.krakken.guardianx.exceptions.PasswordMismatchException;
import com.krakken.guardianx.exceptions.UserDoesNotExistException;
import com.krakken.guardianx.exceptions.UserExistsException;
import com.krakken.guardianx.mappers.UserMapper;
import com.krakken.guardianx.models.User;
import com.krakken.guardianx.models.dto.UserEmailLoginDto;
import com.krakken.guardianx.models.dto.UserPhoneLoginDto;
import com.krakken.guardianx.models.dto.UserRegistrationDto;
import com.krakken.guardianx.repositories.UserRepository;
import com.krakken.guardianx.services.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder encoder;

    private boolean doesUserExistWithPhoneNumber(String phoneNumber) {
        return userRepository.findUserByPhoneNumber(phoneNumber).isPresent();
    }

    private boolean doesUserExistWithEmail(String email) {
        return userRepository.findUserByEmail(email).isPresent();
    }

    private boolean doesPasswordMatch(String requestPassword, String actualPassword) {
        return encoder.matches(requestPassword, actualPassword);
    }

    @Override
    public User loginUserByPhone(UserPhoneLoginDto userPhoneLoginDto) {

        // checking if the user exists or not
        User foundUser = userRepository
                .findUserByPhoneNumber(userPhoneLoginDto.getPhoneNumber())
                .orElseThrow(() -> new UserDoesNotExistException("User not found!"));

        // checking if the password matches
        if (!doesPasswordMatch(userPhoneLoginDto.getPassword(), foundUser.getPassword())) {
            throw new PasswordMismatchException("Password doesn't match!");
        }

        log.info("User with phone number found: {}", foundUser);

        // else returning the correct user
        return foundUser;
    }

    @Override
    public User loginUserByEmail(UserEmailLoginDto userEmailLoginDto) {
        // checking if the user exists or not
        User foundUser = userRepository
                .findUserByEmail(userEmailLoginDto.getEmail())
                .orElseThrow(() -> new UserDoesNotExistException("User not found!"));

        // checking if the password matches
        if (!doesPasswordMatch(userEmailLoginDto.getPassword(), foundUser.getPassword())) {
            throw new PasswordMismatchException("Password doesn't match!");
        }

        log.info("User with email found: {}", foundUser);

        // else returning the correct user
        return foundUser;
    }

    @Override
    public String registerUser(UserRegistrationDto userRegistrationDto) {
        log.info("UserRegistrationInfo: {}", userRegistrationDto);
        if (doesUserExistWithPhoneNumber(userRegistrationDto.getPhoneNumber())
                || doesUserExistWithEmail(userRegistrationDto.getEmail())) {
            throw new UserExistsException("User already exists");
        }


        User user = UserMapper.mapUserFromUserRegistrationDetails(userRegistrationDto);
        // encoding the password here
        user.setPassword(encoder.encode(userRegistrationDto.getPassword()));

        // saving the user
        userRepository.save(user);
        return "Successfully registered the user";
    }
}
