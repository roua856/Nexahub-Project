package com.nexahub.nexahub_backend.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.nexahub.nexahub_backend.entites.Permission;
import com.nexahub.nexahub_backend.entites.Role;
import com.nexahub.nexahub_backend.repositories.PermissionRepository;
import com.nexahub.nexahub_backend.repositories.RoleRepository;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    public List<Role> getAll() {
        return roleRepository.findAll();
    }

    public Role getById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }

    public Role create(Role role) {
        if (roleRepository.existsByNom(role.getNom())) {
            throw new RuntimeException("Role already exists");
        }
        return roleRepository.save(role);
    }

    public Role update(Long id, Role updated) {
        Role role = getById(id);
        role.setNom(updated.getNom());
        role.setDescription(updated.getDescription());
        return roleRepository.save(role);
    }

    public Role assignPermissions(Long roleId, List<Long> permissionIds) {
        Role role = getById(roleId);
        Set<Permission> permissions = new HashSet<>(
                permissionRepository.findAllById(permissionIds));
        role.setPermissions(permissions);
        return roleRepository.save(role);
    }

    public void delete(Long id) {
        roleRepository.deleteById(id);
    }
}