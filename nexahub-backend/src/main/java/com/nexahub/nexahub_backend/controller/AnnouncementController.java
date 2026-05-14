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

import com.nexahub.nexahub_backend.entites.Announcement;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.service.AnnouncementService;
import com.nexahub.nexahub_backend.service.UtilisateurService;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','EMPLOYEE')")
    public ResponseEntity<List<Announcement>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {

        Utilisateur currentUser =
                utilisateurService.getByEmail(userDetails.getUsername());

        return ResponseEntity.ok(
                announcementService.getByCompany(currentUser.getCompany()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Announcement> create(
            @RequestBody Announcement announcement,
            @AuthenticationPrincipal UserDetails userDetails) {

        Utilisateur currentUser =
                utilisateurService.getByEmail(userDetails.getUsername());

        return ResponseEntity.ok(
                announcementService.create(announcement, currentUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Utilisateur currentUser =
                utilisateurService.getByEmail(userDetails.getUsername());

        announcementService.delete(id, currentUser);

        return ResponseEntity.noContent().build();
    }
}