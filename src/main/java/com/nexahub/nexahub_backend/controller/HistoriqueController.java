package com.nexahub.nexahub_backend.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.nexahub.nexahub_backend.entites.HistoriqueAction;
import com.nexahub.nexahub_backend.service.HistoriqueService;

@RestController
@RequestMapping("/api/history")
public class HistoriqueController {

    @Autowired
    private HistoriqueService historiqueService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<List<HistoriqueAction>> getAll() {
        return ResponseEntity.ok(historiqueService.getAll());
    }

    @GetMapping("/company/{company}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','MANAGER')")
    public ResponseEntity<List<HistoriqueAction>> getByCompany(
            @PathVariable String company) {
        return ResponseEntity.ok(historiqueService.getByCompany(company));
    }
}