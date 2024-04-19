package com.krakken.guardianx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;


@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class GuardianXApplication {
    public static void main(String[] args) {
        SpringApplication.run(GuardianXApplication.class, args);
    }
}
