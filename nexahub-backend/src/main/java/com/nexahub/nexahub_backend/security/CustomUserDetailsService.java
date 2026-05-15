package com.nexahub.nexahub_backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.repositories.UtilisateurRepository;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String email) {

        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String role = (user.getRole() != null) ? user.getRole().getNom() : "USER";

        return User.builder()
                .username(user.getEmail())
                .password(user.getMotDePasse())
                .disabled(!user.isActif())
                .authorities(List.of(
                        new SimpleGrantedAuthority("ROLE_" + role)
                ))
                .build();
    }
}