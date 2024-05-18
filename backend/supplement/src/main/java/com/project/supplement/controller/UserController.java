package com.project.supplement.controller;

import com.project.supplement.dto.request.UserDTO;
import com.project.supplement.dto.request.changePasswordDTO;
import com.project.supplement.dto.request.updateUserDTO;
import com.project.supplement.security.auth.AuthResponse;
import com.project.supplement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{email}")
    public UserDTO getUser(@PathVariable String email){
        return userService.getUserByEmail(email);
    }

    @GetMapping("/getUserById/{id}")
    public UserDTO getUserId(@PathVariable Long id){
        return userService.getUserById(id);
    }

    @PutMapping("/updateUser/{id}")
    public UserDTO updateUser(@PathVariable Long id,@RequestBody updateUserDTO updatedUserRequest){
        return userService.updateUser(id, updatedUserRequest);
    }

    @PutMapping("/updatePassword/{id}")
    public ResponseEntity<AuthResponse> updateUserPassword(@PathVariable Long id, @RequestBody changePasswordDTO changePasswordRequest){
        return ResponseEntity.ok(userService.updateUserPassword(id, changePasswordRequest));
    }

    @PutMapping("/updateTokenValidation/{id}")
    public ResponseEntity<AuthResponse> updateTokenValidation(@PathVariable Long id, @RequestBody Long tokenValidation){
        return ResponseEntity.ok(userService.updateTokenValidation(id, tokenValidation));
    }

    @GetMapping("/tokenValidation/{id}")
    public Long getTokenValidation(@PathVariable Long id){
        return userService.getUserTokenValidation(id);
    }

    @GetMapping("/findUserIdByEmail/{email}")
    public Long getUserIdByEmail(@PathVariable String email){
        return userService.findUserIdByEmail(email);
    }

    @PutMapping("/changeUserPassword/{id}")
    public void changeUserPassword(@PathVariable Long id, @RequestBody String newPassword){
        userService.changeUserPassword(id,newPassword);
    }

    @PutMapping("/addFavoriteProduct/{userId}")
    public void addFavoriteProduct(@PathVariable Long userId, @RequestParam Long productId){
        userService.addFavoriteProduct(userId, productId);
    }

    @PutMapping("/removeFavoriteProduct/{userId}")
    public void removeFavoriteProduct(@PathVariable Long userId, @RequestParam Long productId){
        userService.removeFavoriteProduct(userId, productId);
    }
}
