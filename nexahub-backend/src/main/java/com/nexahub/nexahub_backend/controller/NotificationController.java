package com.nexahub.nexahub_backend.controller;

import com.nexahub.nexahub_backend.entites.Notification;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.repositories.UtilisateurRepository;
import com.nexahub.nexahub_backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    private Utilisateur getUser(Authentication auth) {
        return utilisateurRepository.findByEmail(auth.getName()).orElseThrow();
    }

    @GetMapping
    public List<Notification> getMyNotifications(Authentication auth) {
        return notificationService.getForUser(getUser(auth));
    }

    @GetMapping("/count")
    public long getUnreadCount(Authentication auth) {
        return notificationService.countUnread(getUser(auth));
    }

    @PostMapping("/read")
    public void markRead(Authentication auth) {
        notificationService.markAllRead(getUser(auth));
    }
}