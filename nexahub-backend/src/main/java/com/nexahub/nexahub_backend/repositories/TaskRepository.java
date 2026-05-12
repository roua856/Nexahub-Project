package com.nexahub.nexahub_backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nexahub.nexahub_backend.entites.Task;
import com.nexahub.nexahub_backend.entites.Utilisateur;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedTo(Utilisateur user);

}