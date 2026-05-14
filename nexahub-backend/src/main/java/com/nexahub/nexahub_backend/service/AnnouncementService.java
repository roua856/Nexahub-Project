package com.nexahub.nexahub_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nexahub.nexahub_backend.entites.Announcement;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.repositories.AnnouncementRepository;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private HistoriqueService historiqueService;

    public List<Announcement> getByCompany(String company) {
        return announcementRepository.findByCompany(company);
    }

    public Announcement create(Announcement announcement, Utilisateur currentUser) {

        try {
            announcement.setCreatedBy(currentUser);
            announcement.setDate(LocalDateTime.now());

            if (announcement.getType() == null || announcement.getType().isEmpty()) {
                announcement.setType("INFO");
            }

            Announcement saved = announcementRepository.save(announcement);

            historiqueService.logAction(
                    currentUser,
                    "CREATE",
                    "Created announcement: " + saved.getTitle());

            return saved;

        } catch (Exception e) {
            System.err.println("ERROR saving announcement: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void delete(Long id, Utilisateur currentUser) {

        Announcement ann = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        historiqueService.logAction(
                currentUser,
                "DELETE",
                "Deleted announcement: " + ann.getTitle());

        announcementRepository.deleteById(id);
    }
}