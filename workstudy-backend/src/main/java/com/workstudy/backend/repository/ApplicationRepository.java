package com.workstudy.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import com.workstudy.backend.model.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByStudentId(Long studentId);

    @Modifying
    @Transactional
    void deleteByStudentId(Long studentId);

    @Modifying
    @Transactional
    void deleteByJobId(Long jobId);

    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);

    boolean existsByStudentIdAndJobIdAndStatus(Long studentId, Long jobId, String status);
}
