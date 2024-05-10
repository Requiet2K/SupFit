package com.project.supplement.controller;

import com.project.supplement.entity.Address;
import com.project.supplement.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/address")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/getAddresses/{id}")
    public List<Address> getUserAddresses(@PathVariable Long id){
        return addressService.getAddresses(id);
    }

    @GetMapping("/getAddress/{id}")
    public Address getUserAddress(@PathVariable Long id){
        return addressService.getAddress(id);
    }

    @PostMapping(path = "/createAddress/{id}")
    public void createAddress(@PathVariable Long id, @RequestBody Address newAddress){
        addressService.createAddress(id, newAddress);
    }

    @DeleteMapping("/deleteAddress/{id}")
    public void deleteAddress(@PathVariable Long id){
        addressService.deleteAddress(id);
    }

    @PutMapping("/setAddressDefault/{id}")
    public void setAddressDefault(@PathVariable Long id){
        addressService.setAddressDefault(id);
    }

    @PutMapping("/updateAddress/{id}")
    public void updateAddress(@PathVariable Long id,@RequestBody Address updatedAddress){
        addressService.updateAddress(id, updatedAddress);
    }
}
