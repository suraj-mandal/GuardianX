package com.krakken.guardianx.models;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAutoGeneratedKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@DynamoDBTable(tableName = "User")
public class User {

    @JsonProperty("id")
    @DynamoDBHashKey
    @DynamoDBAutoGeneratedKey
    private String id;

    @JsonProperty("fullName")
    @DynamoDBAttribute(attributeName = "full_name")
    private String fullName;

    @Transient
    @JsonIgnore
    @ToString.Exclude
    @DynamoDBAttribute(attributeName = "password")
    private String password;

    @JsonProperty("email")
    @DynamoDBAttribute(attributeName = "email")
    private String email;

    @JsonProperty("phoneNumber")
    @DynamoDBAttribute(attributeName = "phone_number")
    private String phoneNumber;
}
