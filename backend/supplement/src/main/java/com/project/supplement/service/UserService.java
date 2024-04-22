package com.project.supplement.service;

import com.project.supplement.dto.UserDTO;
import com.project.supplement.dto.request.changePasswordDTO;
import com.project.supplement.dto.request.updateUserDTO;
import com.project.supplement.entity.User;
import com.project.supplement.security.auth.AuthResponse;

public interface UserService {
    UserDTO getUserByEmail(String email);
    User findUserByEmail(String email);
    UserDTO getUserById(Long userId);
    UserDTO updateUser(Long userId, updateUserDTO updatedUserRequest);
    AuthResponse updateUserPassword(Long userId, changePasswordDTO changePasswordRequest);
    AuthResponse updateTokenValidation(Long userId, Long tokenValidation);
    Long getUserTokenValidation(Long userId);
    Long findUserIdByEmail(String email);
    void changeUserPassword(Long userId, String newPasswordRequest);
    void addFavoriteProduct(Long userId, Long productId);
    void removeFavoriteProduct(Long userId, Long productId);
}
