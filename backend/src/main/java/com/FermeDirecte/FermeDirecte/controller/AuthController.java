package com.FermeDirecte.FermeDirecte.controller;

import com.FermeDirecte.FermeDirecte.dto.auth.LoginRequest;
import com.FermeDirecte.FermeDirecte.dto.auth.AuthResponse;
import com.FermeDirecte.FermeDirecte.dto.auth.RegisterRequest;
import com.FermeDirecte.FermeDirecte.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** POST /api/auth/login */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /** POST /api/auth/register */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.register(request));
    }
}
