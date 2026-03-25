package com.company.ticketsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassificationResponse {
    private String suggestedCategory;
    private String suggestedPriority;
    private String suggestedResolutionSteps;
    private String estimatedComplexity;
    private String confidence;
}
