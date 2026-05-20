package com.nexahub.nexahub_backend.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.nexahub.nexahub_backend.entites.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    boolean existsByNom(String nom);
    List<Permission> findByCompany(String company);
}