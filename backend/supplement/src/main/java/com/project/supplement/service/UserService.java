package com.project.supplement.service;

import com.project.supplement.dto.UserDTO;
import com.project.supplement.dto.request.changePasswordDTO;
import com.project.supplement.dto.request.updateUserDTO;
import com.project.supplement.security.auth.AuthResponse;

public interface UserService {
    UserDTO getUserByEmail(String email);
    UserDTO getUserById(Long userId);
    UserDTO updateUser(Long userId, updateUserDTO updatedUserRequest);
    AuthResponse updateUserPassword(Long userId, changePasswordDTO changePasswordRequest);
}
