// src/main/java/com/FermeDirecte/FermeDirecte/service/CouponService.java
package com.FermeDirecte.FermeDirecte.service;

import com.FermeDirecte.FermeDirecte.dto.coupon.*;
import com.FermeDirecte.FermeDirecte.entity.Coupon;
import com.FermeDirecte.FermeDirecte.exception.BadRequestException;
import com.FermeDirecte.FermeDirecte.exception.ResourceNotFoundException;
import com.FermeDirecte.FermeDirecte.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    @Transactional
    public CouponResponse creer(CouponRequest request) {

        Coupon coupon = Coupon.builder()
                .code(request.getCode().toUpperCase())
                .type(request.getType())
                .valeur(request.getValeur())
                .dateExpiration(request.getDateExpiration())
                .usagesMax(request.getUsagesMax())
                .usagesActuels(0)
                .actif(true)
                .build();

        return toResponse(couponRepository.save(coupon));
    }

    @Transactional
    public CouponResponse modifier(Long id, CouponRequest request) {

        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", id));

        coupon.setCode(request.getCode().toUpperCase());
        coupon.setType(request.getType());
        coupon.setValeur(request.getValeur());
        coupon.setDateExpiration(request.getDateExpiration());
        coupon.setUsagesMax(request.getUsagesMax());

        return toResponse(couponRepository.save(coupon));
    }

    @Transactional
    public void supprimer(Long id) {

        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", id));

        coupon.setActif(false);
        couponRepository.save(coupon);
    }

    @Transactional(readOnly = true)
    public CouponResponse valider(String code) {

        Coupon coupon = couponRepository.findByCodeAndActifTrue(code.toUpperCase())
                .orElseThrow(() -> new BadRequestException("Coupon invalide ou inexistant"));

        if (coupon.getDateExpiration().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Coupon expiré");
        }

        if (coupon.getUsagesActuels() >= coupon.getUsagesMax()) {
            throw new BadRequestException("Coupon épuisé");
        }

        return toResponse(coupon);
    }

    private CouponResponse toResponse(Coupon c) {
        return CouponResponse.builder()
                .id(c.getId())
                .code(c.getCode())
                .type(c.getType())
                .valeur(c.getValeur())
                .dateExpiration(c.getDateExpiration())
                .usagesActuels(c.getUsagesActuels())
                .actif(c.getActif())
                .build();
    }
}