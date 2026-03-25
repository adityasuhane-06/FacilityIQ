package com.company.ticketsystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String message;
    
    @ManyToOne
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;
    
    @Column(nullable = false)
    private Boolean read = false;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
