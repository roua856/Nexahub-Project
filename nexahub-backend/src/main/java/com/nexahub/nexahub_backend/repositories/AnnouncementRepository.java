package com.nexahub.nexahub_backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nexahub.nexahub_backend.entites.Announcement;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    @Query("SELECT a FROM Announcement a WHERE a.createdBy.company = :company ORDER BY a.date DESC")
    List<Announcement> findByCompany(@Param("company") String company);
}