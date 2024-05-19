package com.project.supplement.controller;

import com.project.supplement.entity.Address;
import com.project.supplement.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping("/{id}")
    public void create(@PathVariable Long id, @RequestBody Address newAddress){
        addressService.create(id, newAddress);
    }

    @DeleteMapping("/{id}")
    public void deleteAddress(@PathVariable Long id){
        addressService.delete(id);
    }

    @PutMapping("/setDefault/{id}")
    public void setDefault(@PathVariable Long id){
        addressService.setDefault(id);
    }

    @PutMapping("/{id}")
    public void updateAddress(@PathVariable Long id,@RequestBody Address updatedAddress){
        addressService.update(id, updatedAddress);
    }
}
