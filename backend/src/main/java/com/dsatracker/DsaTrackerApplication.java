package com.dsatracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Smart DSA Tracker Backend.
 * Spring Boot 3.3 + MongoDB + JWT Authentication
 */
@SpringBootApplication
public class DsaTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(DsaTrackerApplication.class, args);
    }
}
