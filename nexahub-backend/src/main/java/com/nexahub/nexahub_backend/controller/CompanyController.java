package com.nexahub.nexahub_backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.repositories.UtilisateurRepository;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCompanies() {
        List<Utilisateur> allUsers = utilisateurRepository.findAll();
        Map<String, List<Utilisateur>> byCompany = allUsers.stream()
                .collect(Collectors.groupingBy(u ->
                        u.getCompany() != null ? u.getCompany() : "Unknown"));
        List<Map<String, Object>> companies = new ArrayList<>();
        for (Map.Entry<String, List<Utilisateur>> entry : byCompany.entrySet()) {
            Map<String, Object> company = new HashMap<>();
            company.put("name", entry.getKey());
            company.put("totalUsers", entry.getValue().size());
            long activeCount = entry.getValue().stream()
                    .filter(Utilisateur::isActif).count();
            company.put("activeUsers", activeCount);
            companies.add(company);
        }
        return ResponseEntity.ok(companies);
    }
}