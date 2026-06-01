/*  */package com.globalhub.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(csrf -> csrf.disable())  // Disable CSRF for REST API with JWT
            .authorizeExchange(exchanges -> exchanges
                .pathMatchers("/api/auth/**").permitAll()  // Allow auth endpoints without authentication
                .pathMatchers("/api/modules/**").permitAll()  // Allow module status endpoints
                .pathMatchers("/api/**").permitAll()  // Allow all API endpoints (JWT will handle auth)
                .anyExchange().permitAll()
            )
            .httpBasic(httpBasic -> httpBasic.disable())  // Disable HTTP Basic auth
            .build();
    }
}
