package com.project.supplement.service.impl;

import com.project.supplement.dto.UserDTO;
import com.project.supplement.exception.custom_exceptions.UserNotExistsException;
import com.project.supplement.repository.UserRepository;
import com.project.supplement.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public UserServiceImpl(UserRepository theUserRepository, ModelMapper theModelMapper){
        userRepository = theUserRepository;
        modelMapper = theModelMapper;
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(user -> modelMapper.map(user, UserDTO.class))
                .orElseThrow(UserNotExistsException::new);
    }
}
