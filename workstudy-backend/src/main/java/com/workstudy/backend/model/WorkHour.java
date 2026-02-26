package com.workstudy.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "work_hours")
public class WorkHour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int hours;

    @ManyToOne
    private Student student;

    @ManyToOne
    private Job job;

    public Long getId() {
        return id;
    }

    public int getHours() {
        return hours;
    }

    public Student getStudent() {
        return student;
    }

    public Job getJob() {
        return job;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setHours(int hours) {
        this.hours = hours;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public void setJob(Job job) {
        this.job = job;
    }
}
