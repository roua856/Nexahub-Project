package com.nexahub.nexahub_backend.service;

import com.nexahub.nexahub_backend.entites.Notification;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.repositories.NotificationRepository;
import com.nexahub.nexahub_backend.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public void notify(Utilisateur user, String message, String type) {
        Notification n = new Notification();
        n.setUser(user);
        n.setMessage(message);
        n.setType(type);
        notificationRepository.save(n);
    }

    public List<Notification> getForUser(Utilisateur user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public long countUnread(Utilisateur user) {
        return notificationRepository.countByUserAndReadFalse(user);
    }

    public void markAllRead(Utilisateur user) {
        List<Notification> list = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        list.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(list);
    }
}