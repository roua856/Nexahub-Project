package com.nexahub.nexahub_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nexahub.nexahub_backend.entites.Task;
import com.nexahub.nexahub_backend.entites.Utilisateur;
import com.nexahub.nexahub_backend.repositories.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private HistoriqueService historiqueService;

    public List<Task> getAll() {
        return taskRepository.findAll();
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

        if (task.getStatus() == null || task.getStatus().isEmpty()) {
            task.setStatus("TODO");
        }

        Task saved = taskRepository.save(task);

        historiqueService.logAction(
                currentUser,
                "TASK_CREATE",
                "Created task: " + saved.getTitle());

        return saved;
    }

    public Task updateStatus(
            Long id,
            String status,
            Utilisateur currentUser) {

        Task task = getById(id);

        task.setStatus(status);

        historiqueService.logAction(
                currentUser,
                "TASK_UPDATE",
                "Updated task: " + task.getTitle());

        return taskRepository.save(task);
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

        return taskRepository.findAll();
    }
}