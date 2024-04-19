package com.krakken.guardianx.controllers;

import com.krakken.guardianx.models.User;
import com.krakken.guardianx.models.dto.UserEmailLoginDto;
import com.krakken.guardianx.models.dto.UserPhoneLoginDto;
import com.krakken.guardianx.models.dto.UserRegistrationDto;
import com.krakken.guardianx.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthService authService;

    @PostMapping("/login/phone")
    public ResponseEntity<User> loginUserByPhone(@RequestBody UserPhoneLoginDto userPhoneLoginDto) {
        User foundUser = authService.loginUserByPhone(userPhoneLoginDto);
        return ResponseEntity.ok(foundUser);
    }

    @PostMapping("/login/email")
    public ResponseEntity<User> loginUserByEmail(@RequestBody UserEmailLoginDto userEmailLoginDto) {
        User foundUser = authService.loginUserByEmail(userEmailLoginDto);
        return ResponseEntity.ok(foundUser);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegistrationDto userRegistrationDto) {
        String result = authService.registerUser(userRegistrationDto);
        return ResponseEntity.ok(result);
    }

}
