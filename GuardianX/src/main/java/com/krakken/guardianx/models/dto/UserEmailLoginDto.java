package com.krakken.guardianx.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
public class UserEmailLoginDto {
    @JsonProperty("email")
    private String email;

    @JsonProperty("password")
    @ToString.Exclude
    private String password;

}
