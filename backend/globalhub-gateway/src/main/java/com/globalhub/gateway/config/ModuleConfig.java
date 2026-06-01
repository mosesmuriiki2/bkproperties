package com.globalhub.gateway.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "modules")
@Data
public class ModuleConfig {
    
    private Map<String, ModuleSettings> modules = new HashMap<>();
    
    @Data
    public static class ModuleSettings {
        private boolean enabled;
        private String description;
    }
    
    public boolean isModuleEnabled(String moduleName) {
        ModuleSettings settings = modules.get(moduleName);
        return settings != null && settings.isEnabled();
    }
}
