package com.nexahub.nexahub_backend.repositories;

import com.nexahub.nexahub_backend.entites.Notification;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(Utilisateur user);
    long countByUserAndReadFalse(Utilisateur user);
}