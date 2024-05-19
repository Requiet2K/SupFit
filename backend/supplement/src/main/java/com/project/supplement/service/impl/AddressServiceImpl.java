package com.project.supplement.service.impl;

import com.project.supplement.entity.Address;
import com.project.supplement.entity.User;
import com.project.supplement.exception.custom_exceptions.AddressNotExistsException;
import com.project.supplement.exception.custom_exceptions.UserNotExistsException;
import com.project.supplement.repository.AddressRepository;
import com.project.supplement.repository.UserRepository;
import com.project.supplement.service.AddressService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(AddressRepository addressRepository, UserRepository userRepository){
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void setDefault(Long addressId) {
        Address address = addressRepository.findById(addressId).orElseThrow(AddressNotExistsException::new);
        User user = address.getUser();

        Set<Address> userAddresses = user.getAddresses();
        for (Address userAddress : userAddresses) {
            if (userAddress.isDefault()) {
                userAddress.setDefault(false);
                addressRepository.save(userAddress);
            }
        }

        address.setDefault(true);
        addressRepository.save(address);
    }

    @Override
    public void create(Long userId, Address newAddress) {
        User user = userRepository.findById(userId).orElseThrow(UserNotExistsException::new);
        Set<Address> userAddresses = addressRepository.findAllByUserId(user.getId());
        if(userAddresses.isEmpty()){
            newAddress.setDefault(true);
        }
        newAddress.setUser(user);
        addressRepository.save(newAddress);
    }

    @Override
    public void delete(Long addressId) {
        Optional<Address> address = addressRepository.findById(addressId);
        if(address.isPresent()){
            Set<Address> userAddresses = addressRepository.findAllByUserId(address.get().getUser().getId());
            Address removingAddress = address.get();
            if(!userAddresses.isEmpty() && address.get().isDefault()){
                for(Address a : userAddresses){
                    if(!a.equals(removingAddress)){
                        a.setDefault(true);
                        addressRepository.save(a);
                        break;
                    }
                }
            }
            addressRepository.delete(address.get());
        }else{
            throw new AddressNotExistsException();
        }
    }

    @Override
    public void update(Long addressId, Address updatedAddress) {
        Optional<Address> currentAddress = addressRepository.findById(addressId);

        currentAddress.ifPresentOrElse((address -> {
            address.setTitle(updatedAddress.getTitle());
            address.setRecipientFirstName(updatedAddress.getRecipientFirstName());
            address.setRecipientLastName(updatedAddress.getRecipientLastName());
            address.setRecipientPhoneNumber(updatedAddress.getRecipientPhoneNumber());
            address.setCountry(updatedAddress.getCountry());
            address.setCity(updatedAddress.getCity());
            address.setDistrict(updatedAddress.getDistrict());
            address.setAddress(updatedAddress.getAddress());
            addressRepository.save(address);
        }),AddressNotExistsException::new);
    }


}
