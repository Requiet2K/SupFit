package com.project.supplement.controller;

import com.project.supplement.entity.Address;
import com.project.supplement.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping("/{id}")
    public ResponseEntity<Void> create(@PathVariable Long id, @RequestBody Address newAddress) {
        addressService.create(id, newAddress);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/setDefault/{id}")
    public ResponseEntity<Void> setDefault(@PathVariable Long id) {
        addressService.setDefault(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateAddress(@PathVariable Long id, @RequestBody Address updatedAddress) {
        addressService.update(id, updatedAddress);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
