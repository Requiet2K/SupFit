package com.project.supplement.repository;

import com.project.supplement.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findByIsDefaultTrue();
    List<Address> findAllByUserId(Long userId);
}
