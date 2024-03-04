package com.project.supplement.controller;

import com.project.supplement.dto.UserDTO;
import com.project.supplement.entity.User;
import com.project.supplement.repository.UserRepository;
import com.project.supplement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public UserDTO getUser(@PathVariable String id){
        return userService.getUserByEmail(id);
    }

}
