package com.project.supplement.service.impl;

import com.project.supplement.exception.custom_exceptions.NotExistsException;
import com.project.supplement.mapper.UserMapper;
import com.project.supplement.dto.request.UserDTO;
import com.project.supplement.dto.request.changePasswordDTO;
import com.project.supplement.dto.request.updateUserDTO;
import com.project.supplement.entity.Product;
import com.project.supplement.entity.User;
import com.project.supplement.exception.custom_exceptions.PasswordIncorrectException;
import com.project.supplement.repository.ProductRepository;
import com.project.supplement.repository.UserRepository;
import com.project.supplement.security.auth.AuthResponse;
import com.project.supplement.security.config.JwtService;
import com.project.supplement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired
    public UserServiceImpl(@Lazy JwtService jwtService, UserRepository userRepository, UserMapper userMapper,
                           PasswordEncoder passwordEncoder, ProductRepository productRepository) {
        this.jwtService = jwtService;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toUserDTO)
                .orElseThrow(() -> new NotExistsException("User not exists!"));
    }


    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotExistsException("User not exists!"));
    }

    @Override
    public UserDTO getUserById(Long theUserId){
        return userRepository.findById(theUserId)
                .map(userMapper::toUserDTO)
                .orElseThrow(() -> new NotExistsException("User not exists!"));
    }

    @Override
    public UserDTO updateUser(Long userId, updateUserDTO updatedUserRequest) {
        return userRepository.findById(userId)
                .map(foundUser -> {
                    foundUser.setGender(updatedUserRequest.getGender());
                    foundUser.setBirthDate(updatedUserRequest.getBirthDate());
                    foundUser.setPhoneNumber(updatedUserRequest.getPhoneNumber());
                    userRepository.save(foundUser);
                    return userMapper.toUserDTO(foundUser);
                })
                .orElseThrow(() -> new NotExistsException("User not exists!"));
    }

    @Override
    public AuthResponse updateUserPassword(Long userId, changePasswordDTO changePasswordRequest){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotExistsException("User not exists!"));

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

    @Override
    public AuthResponse updateTokenValidation(Long userId, Long tokenValidation) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotExistsException("User not exists!"));
        user.setTokenValidation(tokenValidation);
        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }

    @Override
    public Long getUserTokenValidation(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotExistsException("User not exists!"));
        return user.getTokenValidation();
    }

    @Override
    public Long findUserIdByEmail(String email) {
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new NotExistsException("User not exists!"));
        return user.getId();
    }

    @Override
    public void changeUserPassword(Long userId, String newPassword) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotExistsException("User not exists!"));

        String newPass = passwordEncoder.encode(newPassword);
        user.setPassword(newPass);
        System.out.println(newPassword);
        userRepository.save(user);
    }

    @Override
    public void addFavoriteProduct(Long userId, Long productId) {
        userRepository.findById(userId)
                .ifPresent(user -> {
                    Product product = productRepository.findById(productId)
                            .orElseThrow(() -> new NotExistsException("Product not exists!"));
                    user.getFavorites().add(product);
                    userRepository.save(user);
                });
    }

    @Override
    public void removeFavoriteProduct(Long userId, Long productId) {
        userRepository.findById(userId)
                .ifPresent(user -> {
                    Product product = productRepository.findById(productId)
                            .orElseThrow(() -> new NotExistsException("Product not exists!"));
                    user.getFavorites().remove(product);
                    userRepository.save(user);
                });
    }


}
