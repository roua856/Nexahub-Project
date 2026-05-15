package com.nexahub.nexahub_backend.dto;

import java.util.Set;

public class AuthResponse {

    private String token;
    private String email;
    private String nom;
    private String role;
    private String company;
    private Set<String> permissions;

    // =========================
    // EMPTY CONSTRUCTOR
    // =========================
    public AuthResponse() {
    }

    // =========================
    // FULL CONSTRUCTOR
    // =========================
    public AuthResponse(
            String token,
            String email,
            String nom,
            String role,
            String company,
            Set<String> permissions
    ) {
        this.token = token;
        this.email = email;
        this.nom = nom;
        this.role = role;
        this.company = company;
        this.permissions = permissions;
    }

    // =========================
    // GETTERS & SETTERS
    // =========================

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public Set<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<String> permissions) {
        this.permissions = permissions;
    }
}