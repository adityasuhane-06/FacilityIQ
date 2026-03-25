package com.company.ticketsystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "sla_breaches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SLABreach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;
    
    @Column(nullable = false)
    private LocalDateTime breachedAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private Boolean notifiedManager = false;
}
