package com.company.ticketsystem.service;

import com.company.ticketsystem.entity.Ticket;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class SLAServiceTest {
    
    @InjectMocks
    private SLAService slaService;
    
    @Test
    void testCalculateDueDate_Critical() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dueDate = slaService.calculateDueDate(Ticket.Priority.CRITICAL, now);
        
        assertEquals(now.plusMinutes(120), dueDate);
    }
    
    @Test
    void testCalculateDueDate_High() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dueDate = slaService.calculateDueDate(Ticket.Priority.HIGH, now);
        
        assertEquals(now.plusMinutes(480), dueDate);
    }
    
    @Test
    void testCalculateDueDate_Medium() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dueDate = slaService.calculateDueDate(Ticket.Priority.MEDIUM, now);
        
        assertEquals(now.plusMinutes(1440), dueDate);
    }
    
    @Test
    void testCalculateDueDate_Low() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dueDate = slaService.calculateDueDate(Ticket.Priority.LOW, now);
        
        assertEquals(now.plusMinutes(4320), dueDate);
    }
}
