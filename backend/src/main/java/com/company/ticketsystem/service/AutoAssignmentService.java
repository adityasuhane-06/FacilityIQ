package com.company.ticketsystem.service;

import com.company.ticketsystem.entity.Ticket;
import com.company.ticketsystem.entity.User;
import com.company.ticketsystem.repository.TicketRepository;
import com.company.ticketsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AutoAssignmentService {
    
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final Random random = new Random();
    
    public User assignTicket(Ticket ticket) {
        String category = ticket.getCategory().name().toLowerCase();
        
        // Find technicians with matching specialization
        List<User> specialists = userRepository.findTechniciansBySpecialization(category);
        
        if (!specialists.isEmpty()) {
            return findLeastLoadedTechnician(specialists);
        }
        
        // Fallback to any technician
        List<User> allTechnicians = userRepository.findAllTechnicians();
        
        if (!allTechnicians.isEmpty()) {
            return findLeastLoadedTechnician(allTechnicians);
        }
        
        log.warn("No technicians available for assignment");
        return null;
    }
    
    private User findLeastLoadedTechnician(List<User> technicians) {
        return technicians.stream()
            .min(Comparator.comparingLong(tech -> {
                long count = ticketRepository.countOpenTicketsByAssignee(tech);
                // Add small random factor to break ties
                return count * 1000 + random.nextInt(100);
            }))
            .orElse(null);
    }
}
