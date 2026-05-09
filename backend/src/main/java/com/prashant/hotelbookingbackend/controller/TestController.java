package com.prashant.hotelbookingbackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/cors")
    public Map<String, String> testCors() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "CORS is working!");
        response.put("timestamp", new java.util.Date().toString());
        return response;
    }
}