package com.edis.backendproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.edis.backendproject.security.AppProperties;
import com.edis.backendproject.security.JwtProperties;

@SpringBootApplication
@EnableConfigurationProperties({JwtProperties.class, AppProperties.class})
public class BackendProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendProjectApplication.class, args);
    }
}
