package com.nexahub.nexahub_backend.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.nexahub.nexahub_backend.dto.ChangePasswordRequest;
import com.nexahub.nexahub_backend.dto.RegisterRequest;
import com.nexahub.nexahub_backend.dto.UserUpdateRequest;
import com.nexahub.nexahub_backend.entites.Role;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.repositories.RoleRepository;
import com.nexahub.nexahub_backend.repositories.UtilisateurRepository;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private HistoriqueService historiqueService;

    public List<Utilisateur> getAll() {
        return utilisateurRepository.findAll();
    }

    public List<Utilisateur> getByCompany(String company) {
        return utilisateurRepository.findByCompany(company);
    }

    public Utilisateur getById(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Utilisateur getByEmail(String email) {
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Utilisateur inviteUser(RegisterRequest request, Utilisateur currentUser) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        Role defaultRole = roleRepository.findByNom("USER")
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setNom("USER");
                    r.setDescription("Default role");
                    return roleRepository.save(r);
                });
        Utilisateur user = new Utilisateur();
        user.setNom(request.getNom());
        user.setEmail(request.getEmail());
        user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        user.setCompany(currentUser.getCompany());
        user.setRole(defaultRole);
        user.setActif(true);
        utilisateurRepository.save(user);
        historiqueService.logAction(currentUser, "CREATE",
                "Invited user: " + request.getEmail());
        return user;
    }

    public Utilisateur update(Long id, UserUpdateRequest request, Utilisateur currentUser) {
        Utilisateur user = getById(id);
        if (request.getNom() != null) {
            user.setNom(request.getNom());
        }
        if (request.getRoleId() != null) {
            Role role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            user.setRole(role);
            historiqueService.logAction(currentUser, "ROLE_CHANGE",
                    "Changed role of " + user.getEmail() + " to " + role.getNom());
        }
        user.setActif(request.isActif());
        if (!request.isActif()) {
            historiqueService.logAction(currentUser, "BLOCK",
                    "Blocked user: " + user.getEmail());
        }
        return utilisateurRepository.save(user);
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        Utilisateur user = getByEmail(email);
        if (!passwordEncoder.matches(
                request.getAncienMotDePasse(), user.getMotDePasse())) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setMotDePasse(
                passwordEncoder.encode(request.getNouveauMotDePasse()));
        utilisateurRepository.save(user);
        historiqueService.logAction(user, "PASSWORD_CHANGE", "Password changed");
    }

    public void delete(Long id, Utilisateur currentUser) {
        Utilisateur user = getById(id);
        historiqueService.logAction(currentUser, "DELETE",
                "Deleted user: " + user.getEmail());
        utilisateurRepository.deleteById(id);
    }
}