package com.workstudy.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Student student;

    @ManyToOne
    private Job job;

    private String status;

    @Column(name="resume_path")
    private String resumePath;

    public Long getId() { return id; }

    public Student getStudent() { return student; }

    public Job getJob() { return job; }

    public String getStatus() { return status; }

    public String getResumePath() { return resumePath; }

    public void setId(Long id) { this.id = id; }

    public void setStudent(Student student) { this.student = student; }

    public void setJob(Job job) { this.job = job; }

    public void setStatus(String status) { this.status = status; }

    public void setResumePath(String resumePath) { this.resumePath = resumePath; }
}
