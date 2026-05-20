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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.nexahub.nexahub_backend.entites.Permission;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.service.PermissionService;
import com.nexahub.nexahub_backend.service.UtilisateurService;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping
    public ResponseEntity<List<Permission>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        Utilisateur currentUser = utilisateurService.getByEmail(userDetails.getUsername());
        return ResponseEntity.ok(permissionService.getByCompany(currentUser.getCompany()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Permission> create(
            @RequestBody Permission permission,
            @AuthenticationPrincipal UserDetails userDetails) {
        Utilisateur currentUser = utilisateurService.getByEmail(userDetails.getUsername());
        permission.setCompany(currentUser.getCompany());
        return ResponseEntity.ok(permissionService.create(permission));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        permissionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}