package com.project.supplement.controller;

import com.project.supplement.entity.Coupon;
import com.project.supplement.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponRepository couponRepository;

    @GetMapping("/{code}")
    public Double findCouponByCode(@PathVariable String code){
        Coupon coupon = couponRepository.findByCode(code)
                .orElse(new Coupon(code, 0.0));
        return coupon.getDiscount();
    }
}
