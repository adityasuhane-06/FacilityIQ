package com.company.ticketsystem.controller;

import com.company.ticketsystem.dto.ApiResponse;
import com.company.ticketsystem.entity.User;
import com.company.ticketsystem.repository.UserRepository;
import com.company.ticketsystem.security.JwtUtil;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ApiResponse<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ApiResponse.error("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return ApiResponse.success(Map.of(
                "token", token,
                "user", Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "role", user.getRole())));
    }

    @PostMapping("/logout")
    public ApiResponse<?> logout() {
        return ApiResponse.success(null, "Logged out successfully");
    }

    static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
