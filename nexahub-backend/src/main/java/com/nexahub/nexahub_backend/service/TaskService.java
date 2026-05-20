package com.nexahub.nexahub_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nexahub.nexahub_backend.entites.Task;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.repositories.TaskRepository;
import com.nexahub.nexahub_backend.repositories.UtilisateurRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private HistoriqueService historiqueService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public List<Task> getAll() {
        return taskRepository.findAll();
    }

    public List<Task> getByCompany(String company) {
        return taskRepository.findByCompany(company);
    }

    public List<Task> getByAssignedTo(Utilisateur utilisateur) {
        return taskRepository.findByAssignedTo(utilisateur);
    }

    public Task getById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public Task create(Task task, Utilisateur currentUser) {
        task.setCreatedBy(currentUser);
        task.setCompany(currentUser.getCompany());

        if (task.getStatus() == null || task.getStatus().isEmpty()) {
            task.setStatus("TODO");
        }

        Task saved = taskRepository.save(task);

        historiqueService.logAction(
                currentUser,
                "TASK_CREATE",
                "Created task: " + saved.getTitle());

        if (saved.getAssignedTo() != null) {
            notificationService.notify(
                    saved.getAssignedTo(),
                    "You have been assigned a new task: " + saved.getTitle(),
                    "TASK_ASSIGNED");
        }

        return saved;
    }

    public Task updateStatus(Long id, String status, Utilisateur currentUser) {
        Task task = getById(id);
        task.setStatus(status);

        historiqueService.logAction(
                currentUser,
                "TASK_UPDATE",
                "Updated task: " + task.getTitle());

        Task saved = taskRepository.save(task);

        List<Utilisateur> toNotify = utilisateurRepository.findAll().stream()
                .filter(u -> {
                    String role = u.getRole() != null ? u.getRole().getNom() : "";
                    boolean hasPermission = u.getRole() != null
                            && u.getRole().getPermissions().stream()
                                    .anyMatch(p -> p.getNom().equals("VIEW_TASKS"));
                    return (role.equals("ADMIN") || (role.equals("MANAGER") && hasPermission))
                            && !u.getId().equals(currentUser.getId())
                            && u.getCompany().equals(currentUser.getCompany());
                })
                .collect(Collectors.toList());

        toNotify.forEach(u -> notificationService.notify(
                u,
                currentUser.getNom() + " changed task '" + task.getTitle() + "' to " + status,
                "STATUS_CHANGED"));

        return saved;
    }

    public void delete(Long id, Utilisateur currentUser) {
        Task task = getById(id);
        historiqueService.logAction(
                currentUser,
                "TASK_DELETE",
                "Deleted task: " + task.getTitle());
        taskRepository.deleteById(id);
    }

    public List<Task> getTasksForUser(Utilisateur currentUser) {
        String role = currentUser.getRole().getNom();
        if (role.equals("EMPLOYEE")) {
            return taskRepository.findByAssignedTo(currentUser);
        }
        return taskRepository.findByCompany(currentUser.getCompany());
    }
}