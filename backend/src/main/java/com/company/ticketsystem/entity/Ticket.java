package com.company.ticketsystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_priority", columnList = "priority"),
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_assigned_to", columnList = "assigned_to_id"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.OPEN;
    
    @Enumerated(EnumType.STRING)
    private Category suggestedCategory;
    
    @Enumerated(EnumType.STRING)
    private Priority suggestedPriority;
    
    @Column(columnDefinition = "TEXT")
    private String suggestedResolutionSteps;
    
    @Enumerated(EnumType.STRING)
    private Complexity estimatedComplexity;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime dueAt;
    
    private LocalDateTime resolvedAt;
    
    private LocalDateTime breachedAt;
    
    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;
    
    @ManyToOne
    @JoinColumn(name = "raised_by_id", nullable = false)
    private User raisedBy;
    
    @Column(nullable = false)
    private Boolean llmOverridden = false;
    
    public enum Category {
        BILLING, TECHNICAL, ACCOUNT, GENERAL, INFRASTRUCTURE, HVAC
    }
    
    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }
    
    public enum Status {
        OPEN, ASSIGNED, IN_PROGRESS, ESCALATED, RESOLVED, CLOSED
    }
    
    public enum Complexity {
        SIMPLE, MODERATE, COMPLEX
    }
}
