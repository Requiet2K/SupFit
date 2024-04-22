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

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(AddressRepository addressRepository, UserRepository userRepository){
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void setAddressDefault(Long addressId) {
        Address address = addressRepository.findById(addressId).orElseThrow(AddressNotExistsException::new);
        User user = address.getUser();

        List<Address> userAddresses = user.getAddresses();
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
    public void createAddress(Long userId, Address newAddress) {
        User user = userRepository.findById(userId).orElseThrow(UserNotExistsException::new);
        List<Address> userAddresses = addressRepository.findAllByUserId(user.getId());
        if(userAddresses.isEmpty()){
            newAddress.setDefault(true);
        }
        newAddress.setUser(user);
        addressRepository.save(newAddress);
    }

    @Override
    public void deleteAddress(Long addressId) {
        Optional<Address> address = addressRepository.findById(addressId);
        if(address.isPresent()){
            List<Address> userAddresses = addressRepository.findAllByUserId(address.get().getUser().getId());
            Address removingAddress = address.get();
            if(!userAddresses.isEmpty()){
                for(Address a : userAddresses){
                    if(!a.equals(removingAddress)){
                        a.setDefault(true);
                        addressRepository.save(a);
                        break;
                    }
                }
            }
        }
        address.ifPresentOrElse(addressRepository::delete,
                AddressNotExistsException::new
        );
    }

    @Override
    public List<Address> getAddresses(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(UserNotExistsException::new);
        return addressRepository.findAllByUserId(userId);
    }

    @Override
    public void updateAddress(Long addressId, Address updatedAddress) {
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
