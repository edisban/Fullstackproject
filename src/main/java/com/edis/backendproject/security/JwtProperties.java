package com.edis.backendproject.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;
 
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtProperties {
  
    private String secret;
   
    private long expiration;
}