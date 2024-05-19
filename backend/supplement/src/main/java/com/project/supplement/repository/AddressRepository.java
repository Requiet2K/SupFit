package com.project.supplement.repository;

import com.project.supplement.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface AddressRepository extends JpaRepository<Address, Long> {
    Set<Address> findAllByUserId(Long userId);
}
