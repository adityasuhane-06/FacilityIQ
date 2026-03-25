package com.company.ticketsystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;
    
    @Column(nullable = false)
    private String field;
    
    private String oldValue;
    
    private String newValue;
    
    @ManyToOne
    @JoinColumn(name = "changed_by_id", nullable = false)
    private User changedBy;
    
    @Column(nullable = false)
    private LocalDateTime changedAt = LocalDateTime.now();
}
