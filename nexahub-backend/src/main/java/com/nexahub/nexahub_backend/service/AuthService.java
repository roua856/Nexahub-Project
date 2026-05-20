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

import java.util.Set;
import java.util.stream.Collectors;

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

    // =========================
    // REGISTER
    // =========================
    public AuthResponse register(RegisterRequest request) {

        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        boolean isFirstUser = utilisateurRepository
                .findByCompany(request.getCompany())
                .isEmpty();

        String roleName = isFirstUser ? "ADMIN" : "USER";

        Role role = roleRepository.findByNom(roleName)
                .orElseGet(() -> {
                    Role r = new Role();

                    r.setNom(roleName);

                    r.setDescription(
                            isFirstUser
                                    ? "Company administrator"
                                    : "Default user role"
                    );

                    
                    r.setCompany(request.getCompany());

                    return roleRepository.save(r);
                });

        Utilisateur user = new Utilisateur();

        user.setNom(request.getNom());
        user.setEmail(request.getEmail());
        user.setMotDePasse(
                passwordEncoder.encode(request.getMotDePasse())
        );
        user.setCompany(request.getCompany());
        user.setRole(role);
        user.setActif(true);

        utilisateurRepository.save(user);

        historiqueService.logAction(
                user,
                "REGISTER",
                "New account created"
        );

        String token = jwtUtil.generateToken(user.getEmail());

        // 🔥 DYNAMIC DB PERMISSIONS
        Set<String> permissions = role.getPermissions()
                .stream()
                .map(permission -> permission.getNom())
                .collect(Collectors.toSet());

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getNom(),
                normalizeRole(role.getNom()),
                user.getCompany(),
                permissions
        );
    }

    // =========================
    // LOGIN
    // =========================
    public AuthResponse login(LoginRequest request) {

        Utilisateur user = utilisateurRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        if (!user.isActif()) {
            throw new RuntimeException("Account is blocked");
        }

        if (!passwordEncoder.matches(
                request.getMotDePasse(),
                user.getMotDePasse()
        )) {
            throw new RuntimeException("Invalid email or password");
        }

        historiqueService.logAction(
                user,
                "LOGIN",
                "User logged in"
        );

        String token = jwtUtil.generateToken(user.getEmail());

        String roleName = user.getRole() != null
                ? user.getRole().getNom()
                : "USER";

        // 🔥 DYNAMIC DB PERMISSIONS
        Set<String> permissions = user.getRole()
                .getPermissions()
                .stream()
                .map(permission -> permission.getNom())
                .collect(Collectors.toSet());

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getNom(),
                normalizeRole(roleName),
                user.getCompany(),
                permissions
        );
    }

    // =========================
    // NORMALIZE ROLE
    // =========================
    private String normalizeRole(String role) {

        if (role == null)
            return "USER";

        role = role.toUpperCase();

        if (role.equals("SUPER_ADMIN"))
            return "ADMIN";

        // frontend compatibility
        if (role.equals("USER"))
            return "EMPLOYEE";

        return role;
    }
}