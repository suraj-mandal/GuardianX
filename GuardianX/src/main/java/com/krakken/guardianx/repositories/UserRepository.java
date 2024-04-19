package com.krakken.guardianx.repositories;

import com.krakken.guardianx.models.User;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

@EnableScan
public interface UserRepository extends CrudRepository<User, String> {
    Optional<User> findUserByPhoneNumber(String phoneNumber);
    Optional<User> findUserByEmail(String email);
}
