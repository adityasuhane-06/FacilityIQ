package com.company.ticketsystem.dto;

import com.company.ticketsystem.entity.Ticket;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateTicketRequest {
    @NotBlank
    @Size(max = 200)
    private String title;
    
    @NotBlank
    private String description;
    
    @NotNull
    private Ticket.Category category;
    
    @NotNull
    private Ticket.Priority priority;
    
    private Ticket.Category suggestedCategory;
    private Ticket.Priority suggestedPriority;
    private String suggestedResolutionSteps;
    private Ticket.Complexity estimatedComplexity;
    private Boolean llmOverridden;
}
