package com.nexahub.nexahub_backend.controller;

import java.util.List;
import java.util.Map;

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

import com.nexahub.nexahub_backend.entites.Task;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.service.TaskService;
import com.nexahub.nexahub_backend.service.UtilisateurService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','EMPLOYEE')")
    public ResponseEntity<List<Task>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {

        Utilisateur currentUser =
                utilisateurService.getByEmail(userDetails.getUsername());

        return ResponseEntity.ok(
                taskService.getTasksForUser(currentUser));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Task>> getMyTasks(
            @AuthenticationPrincipal UserDetails userDetails) {

        Utilisateur currentUser =
                utilisateurService.getByEmail(userDetails.getUsername());

        return ResponseEntity.ok(
                taskService.getByAssignedTo(currentUser));
    }
    

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Task> create(
            @RequestBody Task task,
            @AuthenticationPrincipal UserDetails userDetails) {

        Utilisateur currentUser =
                utilisateurService.getByEmail(userDetails.getUsername());

        return ResponseEntity.ok(
                taskService.create(task, currentUser));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Task> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {

        Utilisateur currentUser =
                utilisateurService.getByEmail(userDetails.getUsername());

        return ResponseEntity.ok(
                taskService.updateStatus(
                         id,
                        body.get("status"),
                        currentUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Utilisateur currentUser =
                utilisateurService.getByEmail(userDetails.getUsername());

        taskService.delete(id, currentUser);

        return ResponseEntity.noContent().build();
    }
}