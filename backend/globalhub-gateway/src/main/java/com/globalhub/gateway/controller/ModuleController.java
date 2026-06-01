package com.globalhub.gateway.controller;

import com.globalhub.gateway.config.ModuleConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {
    
    private final ModuleConfig moduleConfig;
    
    @GetMapping
    public Map<String, Object> getEnabledModules() {
        Map<String, Object> response = new HashMap<>();
        Map<String, Boolean> enabledModules = new HashMap<>();
        
        moduleConfig.getModules().forEach((name, settings) -> {
            enabledModules.put(name, settings.isEnabled());
        });
        
        response.put("modules", enabledModules);
        return response;
    }
    
    @GetMapping("/status")
    public Map<String, Object> getModuleStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("modules", moduleConfig.getModules());
        return response;
    }
}
