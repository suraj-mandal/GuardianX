package com.krakken.guardianx.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
public class UserRegistrationDto {

    @JsonProperty("fullName")
    private String name;

    @JsonProperty("password")
    @ToString.Exclude
    private String password;

    @JsonProperty("phoneNumber")
    private String phoneNumber;

    @JsonProperty("email")
    private String email;
}
