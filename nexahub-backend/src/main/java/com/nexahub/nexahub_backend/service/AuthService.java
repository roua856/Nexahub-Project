package com.nexahub.nexahub_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.nexahub.nexahub_backend.dto.AuthResponse;
import com.nexahub.nexahub_backend.dto.LoginRequest;
import com.nexahub.nexahub_backend.dto.RegisterRequest;
import com.nexahub.nexahub_backend.entites.Role;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.repositories.RoleRepository;
import com.nexahub.nexahub_backend.repositories.UtilisateurRepository;
import com.nexahub.nexahub_backend.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private HistoriqueService historiqueService;

    public AuthResponse register(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        boolean isFirstUser = utilisateurRepository
                .findByCompany(request.getCompany()).isEmpty();
        String roleName = isFirstUser ? "ADMIN" : "USER";
        Role role = roleRepository.findByNom(roleName)
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setNom(roleName);
                    r.setDescription(isFirstUser ?
                            "Company administrator" : "Default user role");
                    return roleRepository.save(r);
                });
        Utilisateur user = new Utilisateur();
        user.setNom(request.getNom());
        user.setEmail(request.getEmail());
        user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        user.setCompany(request.getCompany());
        user.setRole(role);
        user.setActif(true);
        utilisateurRepository.save(user);
        historiqueService.logAction(user, "REGISTER", "New account created");
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(),
                user.getNom(), role.getNom(), user.getCompany());
    }

    public AuthResponse login(LoginRequest request) {
        Utilisateur user = utilisateurRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!user.isActif()) {
            throw new RuntimeException("Account is blocked");
        }
        if (!passwordEncoder.matches(
                request.getMotDePasse(), user.getMotDePasse())) {
            throw new RuntimeException("Invalid email or password");
        }
        historiqueService.logAction(user, "LOGIN", "User logged in");
        String token = jwtUtil.generateToken(user.getEmail());
        String roleName = user.getRole() != null ?
                user.getRole().getNom() : "USER";
        return new AuthResponse(token, user.getEmail(),
                user.getNom(), roleName, user.getCompany());
    }
}