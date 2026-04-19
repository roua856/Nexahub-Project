package com.nexahub.nexahub_backend.dto;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String ancienMotDePasse;
    private String nouveauMotDePasse;
}