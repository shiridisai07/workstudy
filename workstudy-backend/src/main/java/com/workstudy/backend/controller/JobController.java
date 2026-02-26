package com.workstudy.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.transaction.Transactional;

import com.workstudy.backend.model.Job;
import com.workstudy.backend.repository.JobRepository;
import com.workstudy.backend.repository.ApplicationRepository;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @PostMapping
    public Job addJob(@RequestBody Job job) {
        return jobRepository.save(job);
    }

    @GetMapping
    public List<Job> getJobs() {
        return jobRepository.findAll();
    }

    @Transactional
    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Long id) {

        System.out.println("Deleting job ID: " + id);

        applicationRepository.deleteByJobId(id);

        jobRepository.deleteById(id);
    }
}
