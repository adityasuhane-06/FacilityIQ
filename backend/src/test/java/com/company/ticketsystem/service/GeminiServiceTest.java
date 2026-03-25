package com.company.ticketsystem.service;

import com.company.ticketsystem.dto.ClassificationResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class GeminiServiceTest {
    
    @InjectMocks
    private GeminiService geminiService;
    
    @Test
    void testClassifyTicket_GracefulFailure() {
        // Set invalid API key to simulate failure
        ReflectionTestUtils.setField(geminiService, "apiKey", "invalid-key");
        ReflectionTestUtils.setField(geminiService, "apiUrl", "https://invalid-url.com");
        
        String description = "The server is down and users cannot access the system";
        
        // Should return null instead of throwing exception
        ClassificationResponse result = geminiService.classifyTicket(description);
        
        assertNull(result, "Service should return null on failure, not throw exception");
    }
}
