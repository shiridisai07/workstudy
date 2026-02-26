package com.workstudy.backend.controller;



import java.io.File;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.workstudy.backend.model.Application;
import com.workstudy.backend.model.Job;
import com.workstudy.backend.model.Student;
import com.workstudy.backend.repository.ApplicationRepository;
import com.workstudy.backend.repository.JobRepository;
import com.workstudy.backend.repository.StudentRepository;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobRepository jobRepository;

    @PostMapping(value="/apply", consumes="multipart/form-data")
    public Application applyJob(
            @RequestParam Long studentId,
            @RequestParam Long jobId,
            @RequestParam("resume") MultipartFile resume
    ) throws Exception {

        Student student = studentRepository.findById(studentId).orElseThrow();
        Job job = jobRepository.findById(jobId).orElseThrow();

        String baseDir = System.getProperty("user.dir");
        File uploadDir = new File(baseDir + File.separator + "uploads");

        if(!uploadDir.exists()) uploadDir.mkdirs();

        String name = System.currentTimeMillis()+"_"+resume.getOriginalFilename();
        File dest = new File(uploadDir,name);

        resume.transferTo(dest);

        Application app = new Application();
        app.setStudent(student);
        app.setJob(job);
        app.setStatus("PENDING");
        app.setResumePath(dest.getAbsolutePath());

        return applicationRepository.save(app);
    }

    @GetMapping
    public List<Application> getAll(){
        return applicationRepository.findAll();
    }

    @GetMapping("/student/{id}")
    public List<Application> byStudent(@PathVariable Long id){
        return applicationRepository.findByStudentId(id);
    }

    @PutMapping("/{id}")
    public Application approve(@PathVariable Long id,@RequestParam String status){
        Application app=applicationRepository.findById(id).orElseThrow();
        app.setStatus(status);
        return applicationRepository.save(app);
    }

    @GetMapping("/resume/{id}")
    public ResponseEntity<Resource> getResume(@PathVariable Long id) throws Exception {

        Application app = applicationRepository.findById(id).orElseThrow();

        File file = new File(app.getResumePath());
        Resource resource = new UrlResource(file.toURI());

        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition",
                        "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    }

