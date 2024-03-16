package com.project.supplement.controller;

import com.project.supplement.dto.UserDTO;
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
    public UserDTO getUser(@PathVariable Long id){
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

}
