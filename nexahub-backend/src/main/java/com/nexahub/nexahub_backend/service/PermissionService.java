package com.nexahub.nexahub_backend.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.nexahub.nexahub_backend.entites.Permission;
import com.nexahub.nexahub_backend.repositories.PermissionRepository;

@Service
public class PermissionService {

    @Autowired
    private PermissionRepository permissionRepository;

    public List<Permission> getAll() {
        return permissionRepository.findAll();
    }

    public List<Permission> getByCompany(String company) {
        return permissionRepository.findByCompany(company);
    }

    public Permission create(Permission permission) {
        return permissionRepository.save(permission);
    }

    public void delete(Long id) {
        permissionRepository.deleteById(id);
    }
}