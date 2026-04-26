package com.nexahub.nexahub_backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nom;
    private String email;
    private String motDePasse;
    private String company;
}