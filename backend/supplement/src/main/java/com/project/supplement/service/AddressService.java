package com.project.supplement.service;

import com.project.supplement.entity.Address;

import java.util.List;

public interface AddressService {

    void setAddressDefault(Long addressId);
    void createAddress(Long userId, Address newAddress);
    void deleteAddress(Long addressId);
    List<Address> getAddresses(Long userId);
    Address getAddress(Long addressId);
    void updateAddress(Long addressId, Address updatedAddress);
}
