package com.edis.backendproject.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;
 
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
public class JwtProperties {
  
    private String secret;
   
    private long expiration;
}