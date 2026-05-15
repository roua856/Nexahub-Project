package com.nexahub.nexahub_backend.security;

import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.entites.Permission;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {

    private final Utilisateur user;

    public CustomUserDetails(Utilisateur user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return user.getRole()
                .getPermissions()
                .stream()
                .map(p -> new SimpleGrantedAuthority(p.getNom()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getPassword() {
        return user.getMotDePasse();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return user.isActif();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.isActif();
    }

    public Utilisateur getUser() {
        return user;
    }
}