package com.project.supplement.service;

import com.project.supplement.entity.Address;

import java.util.List;
import java.util.Set;

public interface AddressService {
    void setDefault(Long addressId);
    void create(Long userId, Address newAddress);
    void delete(Long addressId);
    void update(Long addressId, Address updatedAddress);
}
