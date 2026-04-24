package com.nexahub.nexahub_backend.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.nexahub.nexahub_backend.dto.ChangePasswordRequest;
import com.nexahub.nexahub_backend.dto.RegisterRequest;
import com.nexahub.nexahub_backend.dto.UserUpdateRequest;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.service.UtilisateurService;

@RestController
@RequestMapping("/api/users")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','MANAGER')")
    public ResponseEntity<List<Utilisateur>> getAll() {
        return ResponseEntity.ok(utilisateurService.getAll());
    }

    @GetMapping("/company/{company}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','MANAGER')")
    public ResponseEntity<List<Utilisateur>> getByCompany(@PathVariable String company) {
        return ResponseEntity.ok(utilisateurService.getByCompany(company));
    }

    @GetMapping("/me")
    public ResponseEntity<Utilisateur> getMe(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                utilisateurService.getByEmail(userDetails.getUsername()));
    }

    @PostMapping("/invite")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Utilisateur> inviteUser(
            @RequestBody RegisterRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Utilisateur currentUser =
                utilisateurService.getByEmail(userDetails.getUsername());
        request.setCompany(currentUser.getCompany());
        return ResponseEntity.ok(
                utilisateurService.inviteUser(request, currentUser));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Utilisateur> update(
            @PathVariable Long id,
            @RequestBody UserUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Utilisateur currentUser =
                utilisateurService.getByEmail(userDetails.getUsername());
        return ResponseEntity.ok(
                utilisateurService.update(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Utilisateur currentUser =
                utilisateurService.getByEmail(userDetails.getUsername());
        utilisateurService.delete(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        utilisateurService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok("Password changed successfully");
    }
}