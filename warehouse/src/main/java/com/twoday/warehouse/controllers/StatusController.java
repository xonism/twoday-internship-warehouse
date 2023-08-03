package com.twoday.warehouse.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/status")
public class StatusController {

    @GetMapping
    public ResponseEntity<String> getStatus() {
        String message = "Welcome to Tomcat!";
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
