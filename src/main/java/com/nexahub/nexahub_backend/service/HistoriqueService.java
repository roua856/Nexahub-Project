package com.nexahub.nexahub_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.nexahub.nexahub_backend.entites.HistoriqueAction;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.repositories.HistoriqueActionRepository;

@Service
public class HistoriqueService {

    @Autowired
    private HistoriqueActionRepository historiqueRepository;

    public void logAction(Utilisateur utilisateur, String action, String details) {
        HistoriqueAction log = new HistoriqueAction();
        log.setUtilisateur(utilisateur);
        log.setAction(action);
        log.setDetails(details);
        log.setCompany(utilisateur.getCompany());
        log.setDateAction(LocalDateTime.now());
        historiqueRepository.save(log);
    }

    public List<HistoriqueAction> getByCompany(String company) {
        return historiqueRepository.findByCompanyOrderByDateActionDesc(company);
    }

    public List<HistoriqueAction> getAll() {
        return historiqueRepository.findAll();
    }
}