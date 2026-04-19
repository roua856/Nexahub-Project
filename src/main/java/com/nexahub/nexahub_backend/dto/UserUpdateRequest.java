package com.nexahub.nexahub_backend.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String nom;
    private Long roleId;
    private boolean actif;
}