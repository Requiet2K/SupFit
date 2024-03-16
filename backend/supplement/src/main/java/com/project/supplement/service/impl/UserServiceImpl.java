package com.project.supplement.service.impl;

import com.project.supplement.dto.UserDTO;
import com.project.supplement.dto.request.changePasswordDTO;
import com.project.supplement.dto.request.updateUserDTO;
import com.project.supplement.entity.User;
import com.project.supplement.exception.custom_exceptions.PasswordIncorrectException;
import com.project.supplement.exception.custom_exceptions.UserNotExistsException;
import com.project.supplement.repository.UserRepository;
import com.project.supplement.security.auth.AuthResponse;
import com.project.supplement.security.config.JwtService;
import com.project.supplement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    @Override
    public UserDTO getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(user -> modelMapper.map(user, UserDTO.class))
                .orElseThrow(UserNotExistsException::new);
    }

    @Override
    public UserDTO getUserById(Long theUserId){
        return userRepository.findById(theUserId).map(
                foundUser -> modelMapper.map(foundUser, UserDTO.class))
                .orElseThrow(UserNotExistsException::new);
    }

    @Override
    public UserDTO updateUser(Long userId, updateUserDTO updatedUserRequest) {
        return userRepository.findById(userId)
                .map(foundUser -> {
                    foundUser.setGender(updatedUserRequest.getGender());
                    foundUser.setBirthDate(updatedUserRequest.getBirthDate());
                    foundUser.setPhoneNumber(updatedUserRequest.getPhoneNumber());
                    userRepository.save(foundUser);
                    return modelMapper.map(foundUser, UserDTO.class);
                })
                .orElseThrow(UserNotExistsException::new);
    }
    @Override
    public AuthResponse updateUserPassword(Long userId, changePasswordDTO changePasswordRequest){

        User user = userRepository.findById(userId)
                .orElseThrow(UserNotExistsException::new);

        if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
            throw new PasswordIncorrectException();
        }

        String newPassword = passwordEncoder.encode(changePasswordRequest.getNewPassword());
        user.setPassword(newPassword);

        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }

}
