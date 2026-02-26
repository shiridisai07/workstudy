package com.workstudy.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.workstudy.backend.model.WorkHour;

public interface WorkHourRepository extends JpaRepository<WorkHour, Long> {

    List<WorkHour> findByStudentId(Long studentId);

    List<WorkHour> findByStudentIdAndJobId(Long studentId, Long jobId);
}
