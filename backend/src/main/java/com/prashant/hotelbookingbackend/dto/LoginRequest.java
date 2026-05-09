// src/main/java/com/prashant/hotelbookingbackend/dto/LoginRequest.java
package com.prashant.hotelbookingbackend.dto;

public class LoginRequest {
    private String email;
    private String password;
    
    // Getters and setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}