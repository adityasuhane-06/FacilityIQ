package com.company.ticketsystem.service;

import com.company.ticketsystem.dto.ClassificationResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@Slf4j
public class GeminiService {
    
    @Value("${app.gemini.api-key}")
    private String apiKey;
    
    @Value("${app.gemini.api-url}")
    private String apiUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    private static final String CLASSIFICATION_PROMPT = """
        You are a facility support ticket classifier for a smart building management system.
        Analyze the following support ticket description and return a JSON response only, no explanation.
        
        Categories available: billing, technical, account, general, infrastructure, hvac
        
        Priority rules:
        - critical: safety risk or complete system failure
        - high: major functionality broken, affecting multiple people
        - medium: partial functionality issue, workaround exists
        - low: minor issue, cosmetic, or feature request
        
        Description: %s
        
        Return exactly this JSON format:
        {
          "suggestedCategory": "",
          "suggestedPriority": "",
          "suggestedResolutionSteps": "numbered steps as a string",
          "estimatedComplexity": "simple|moderate|complex",
          "confidence": "low|medium|high"
        }
        """;
    
    public ClassificationResponse classifyTicket(String description) {
        try {
            String prompt = String.format(CLASSIFICATION_PROMPT, description);
            
            Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                    Map.of("parts", new Object[]{
                        Map.of("text", prompt)
                    })
                },
                "generationConfig", Map.of(
                    "temperature", 0.2,
                    "maxOutputTokens", 500
                )
            );
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            String url = apiUrl + "?key=" + apiKey;
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return parseGeminiResponse(response.getBody());
            }
            
            log.error("Gemini API returned non-OK status: {}", response.getStatusCode());
            return null;
            
        } catch (Exception e) {
            log.error("Failed to classify ticket with Gemini: {}", e.getMessage(), e);
            return null;
        }
    }
    
    private ClassificationResponse parseGeminiResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");
            
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).path("content");
                JsonNode parts = content.path("parts");
                
                if (parts.isArray() && parts.size() > 0) {
                    String text = parts.get(0).path("text").asText();
                    
                    // Extract JSON from markdown code blocks if present
                    text = text.replaceAll("```json\\s*", "").replaceAll("```\\s*$", "").trim();
                    
                    return objectMapper.readValue(text, ClassificationResponse.class);
                }
            }
            
            log.error("Unexpected Gemini response structure");
            return null;
            
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage(), e);
            return null;
        }
    }
}
