package com.project.supplement.service;

import com.project.supplement.dto.UserDTO;
import org.springframework.stereotype.Service;

import java.util.Optional;

public interface UserService {
    UserDTO getUserByEmail(String email);
}
