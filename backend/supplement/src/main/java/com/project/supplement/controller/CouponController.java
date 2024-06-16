package com.project.supplement.controller;

import com.project.supplement.entity.Coupon;
import com.project.supplement.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponRepository couponRepository;

    @GetMapping("/{code}")
    public ResponseEntity<Double> findCouponByCode(@PathVariable String code) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElse(new Coupon(code, 0.0));

        return ResponseEntity.ok(coupon.getDiscount());
    }
}
