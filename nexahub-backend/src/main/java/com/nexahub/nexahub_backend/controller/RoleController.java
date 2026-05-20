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
import com.nexahub.nexahub_backend.entites.Role;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.service.RoleService;
import com.nexahub.nexahub_backend.service.UtilisateurService;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping
    public ResponseEntity<List<Role>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        Utilisateur currentUser = utilisateurService.getByEmail(userDetails.getUsername());
        return ResponseEntity.ok(roleService.getByCompany(currentUser.getCompany()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Role> create(
            @RequestBody Role role,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            throw new RuntimeException("User not authenticated");
        }

        Utilisateur currentUser =
            utilisateurService.getByEmail(userDetails.getUsername());

        if (currentUser == null) {
            throw new RuntimeException("User not found");
        }

        role.setCompany(currentUser.getCompany());

        return ResponseEntity.ok(roleService.create(role));
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Role> update(
            @PathVariable Long id,
            @RequestBody Role role) {
        return ResponseEntity.ok(roleService.update(id, role));
    }

    @PutMapping("/{id}/permissions")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Role> assignPermissions(
            @PathVariable Long id,
            @RequestBody List<Long> permissionIds) {
        return ResponseEntity.ok(roleService.assignPermissions(id, permissionIds));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        roleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}