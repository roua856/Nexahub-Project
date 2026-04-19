package com.nexahub.nexahub_backend.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.nexahub.nexahub_backend.entites.HistoriqueAction;

@Repository
public interface HistoriqueActionRepository extends JpaRepository<HistoriqueAction, Long> {
    List<HistoriqueAction> findByCompanyOrderByDateActionDesc(String company);
}