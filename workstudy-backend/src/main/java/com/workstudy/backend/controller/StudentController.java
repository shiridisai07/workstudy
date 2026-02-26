package com.workstudy.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.workstudy.backend.model.Student;
import com.workstudy.backend.repository.StudentRepository;

import jakarta.transaction.Transactional;

import com.workstudy.backend.repository.ApplicationRepository;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public Student register(@RequestBody Student student) {

        student.setPassword(encoder.encode(student.getPassword()));

        if (student.getRole() == null) {
            student.setRole("student");
        }

        return studentRepository.save(student);
    }

    @PostMapping("/login")
    public Student login(@RequestBody Student req) {

        Student s = studentRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not registered"
                ));

        if (!encoder.matches(req.getPassword(), s.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid password"
            );
        }

        return s;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void deleteAccount(@PathVariable Long id) {

        applicationRepository.deleteByStudentId(id);
        studentRepository.deleteById(id);
    }

}
