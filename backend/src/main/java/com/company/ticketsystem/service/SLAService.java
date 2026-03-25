package com.company.ticketsystem.service;

import com.company.ticketsystem.entity.SLABreach;
import com.company.ticketsystem.entity.Ticket;
import com.company.ticketsystem.repository.SLABreachRepository;
import com.company.ticketsystem.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SLAService {
    
    private final TicketRepository ticketRepository;
    private final SLABreachRepository slaBreachRepository;
    private final NotificationService notificationService;
    
    public LocalDateTime calculateDueDate(Ticket.Priority priority, LocalDateTime createdAt) {
        int minutes = switch (priority) {
            case CRITICAL -> 120;
            case HIGH -> 480;
            case MEDIUM -> 1440;
            case LOW -> 4320;
        };
        return createdAt.plusMinutes(minutes);
    }
    
    @Scheduled(fixedRate = 900000) // Every 15 minutes
    @Transactional
    public void checkSLABreaches() {
        log.info("Running SLA breach check...");
        
        LocalDateTime now = LocalDateTime.now();
        List<Ticket> breachedTickets = ticketRepository.findBreachedTickets(now);
        
        for (Ticket ticket : breachedTickets) {
            ticket.setBreachedAt(now);
            ticket.setStatus(Ticket.Status.ESCALATED);
            ticketRepository.save(ticket);
            
            SLABreach breach = new SLABreach();
            breach.setTicket(ticket);
            breach.setBreachedAt(now);
            breach.setNotifiedManager(true);
            slaBreachRepository.save(breach);
            
            notificationService.notifySLABreach(ticket);
            
            log.warn("SLA breach detected for ticket #{}", ticket.getId());
        }
        
        log.info("SLA breach check completed. Found {} breaches", breachedTickets.size());
    }
}
