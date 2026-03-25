package com.company.ticketsystem.service;

import com.company.ticketsystem.entity.Ticket;
import com.company.ticketsystem.entity.User;
import com.company.ticketsystem.repository.TicketRepository;
import com.company.ticketsystem.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AutoAssignmentServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private TicketRepository ticketRepository;
    
    @InjectMocks
    private AutoAssignmentService autoAssignmentService;
    
    @Test
    void testAssignTicket_WithSpecialization() {
        Ticket ticket = new Ticket();
        ticket.setCategory(Ticket.Category.TECHNICAL);
        
        User tech1 = new User();
        tech1.setId(1L);
        tech1.setSpecialization("technical");
        
        User tech2 = new User();
        tech2.setId(2L);
        tech2.setSpecialization("technical");
        
        when(userRepository.findTechniciansBySpecialization("technical"))
            .thenReturn(Arrays.asList(tech1, tech2));
        when(ticketRepository.countOpenTicketsByAssignee(tech1)).thenReturn(2L);
        when(ticketRepository.countOpenTicketsByAssignee(tech2)).thenReturn(5L);
        
        User assigned = autoAssignmentService.assignTicket(ticket);
        
        assertNotNull(assigned);
        assertEquals(1L, assigned.getId());
    }
    
    @Test
    void testAssignTicket_NoSpecialists() {
        Ticket ticket = new Ticket();
        ticket.setCategory(Ticket.Category.BILLING);
        
        User tech1 = new User();
        tech1.setId(1L);
        
        when(userRepository.findTechniciansBySpecialization("billing"))
            .thenReturn(List.of());
        when(userRepository.findAllTechnicians())
            .thenReturn(List.of(tech1));
        when(ticketRepository.countOpenTicketsByAssignee(tech1)).thenReturn(3L);
        
        User assigned = autoAssignmentService.assignTicket(ticket);
        
        assertNotNull(assigned);
        assertEquals(1L, assigned.getId());
    }
    
    @Test
    void testAssignTicket_NoTechnicians() {
        Ticket ticket = new Ticket();
        ticket.setCategory(Ticket.Category.GENERAL);
        
        when(userRepository.findTechniciansBySpecialization(any()))
            .thenReturn(List.of());
        when(userRepository.findAllTechnicians())
            .thenReturn(List.of());
        
        User assigned = autoAssignmentService.assignTicket(ticket);
        
        assertNull(assigned);
    }
}
