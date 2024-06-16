package com.project.supplement.controller;

import com.project.supplement.dto.request.changePasswordDTO;
import com.project.supplement.dto.request.updateUserDTO;
import com.project.supplement.dto.request.UserDTO;
import com.project.supplement.security.auth.AuthResponse;
import com.project.supplement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        UserDTO user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/findIdByEmail/{email}")
    public ResponseEntity<Long> getUserIdByEmail(@PathVariable String email) {
        Long userId = userService.findUserIdByEmail(email);
        return ResponseEntity.ok(userId);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody updateUserDTO updatedUserRequest) {
        UserDTO updatedUser = userService.updateUser(id, updatedUserRequest);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/changePassword/{id}")
    public ResponseEntity<AuthResponse> changePassword(@PathVariable Long id, @RequestBody changePasswordDTO changePasswordRequest) {
        AuthResponse response = userService.updateUserPassword(id, changePasswordRequest);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/updateTokenValidation/{id}")
    public ResponseEntity<AuthResponse> updateTokenValidation(@PathVariable Long id, @RequestBody Long tokenValidation) {
        AuthResponse response = userService.updateTokenValidation(id, tokenValidation);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getTokenValidation/{id}")
    public ResponseEntity<Long> getTokenValidation(@PathVariable Long id) {
        Long tokenValidation = userService.getUserTokenValidation(id);
        return ResponseEntity.ok(tokenValidation);
    }

    @PutMapping("/forgetPassword/{id}")
    public ResponseEntity<Void> changeUserPassword(@PathVariable Long id, @RequestBody String newPassword) {
        userService.changeUserPassword(id, newPassword);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/addFavorite/{userId}")
    public ResponseEntity<Void> addFavoriteProduct(@PathVariable Long userId, @RequestParam Long productId) {
        userService.addFavoriteProduct(userId, productId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/removeFavorite/{userId}")
    public ResponseEntity<Void> removeFavoriteProduct(@PathVariable Long userId, @RequestParam Long productId) {
        userService.removeFavoriteProduct(userId, productId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
