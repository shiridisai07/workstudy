package com.workstudy.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.workstudy.backend.model.Job;
import com.workstudy.backend.model.Student;
import com.workstudy.backend.model.WorkHour;
import com.workstudy.backend.repository.ApplicationRepository;
import com.workstudy.backend.repository.JobRepository;
import com.workstudy.backend.repository.StudentRepository;
import com.workstudy.backend.repository.WorkHourRepository;

@RestController
@RequestMapping("/api/hours")
@CrossOrigin(origins = "http://localhost:5173")
public class WorkHourController {

    @Autowired
    private WorkHourRepository workHourRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @PostMapping
    public WorkHour addHours(@RequestParam Long studentId,
                             @RequestParam Long jobId,
                             @RequestParam int hours) {

        boolean approved = applicationRepository
            .existsByStudentIdAndJobIdAndStatus(studentId, jobId, "APPROVED");

        if(!approved){
            throw new RuntimeException("Job not approved");
        }

        Student student = studentRepository.findById(studentId).orElseThrow();
        Job job = jobRepository.findById(jobId).orElseThrow();

        WorkHour wh = new WorkHour();
        wh.setStudent(student);
        wh.setJob(job);
        wh.setHours(hours);

        return workHourRepository.save(wh);
    }

    @GetMapping
    public List<WorkHour> getAllHours() {
        return workHourRepository.findAll();
    }

    @GetMapping("/student/{id}")
    public List<WorkHour> getStudentHours(@PathVariable Long id){
        return workHourRepository.findByStudentId(id);
    }
}
