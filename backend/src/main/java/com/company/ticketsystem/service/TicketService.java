package com.company.ticketsystem.service;

import com.company.ticketsystem.dto.CreateTicketRequest;
import com.company.ticketsystem.dto.TicketStatsResponse;
import com.company.ticketsystem.entity.*;
import com.company.ticketsystem.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {
    
    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final AuditLogRepository auditLogRepository;
    private final SLAService slaService;
    private final AutoAssignmentService autoAssignmentService;
    private final NotificationService notificationService;
    
    @Transactional
    public Ticket createTicket(CreateTicketRequest request, User user) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setRaisedBy(user);
        ticket.setSuggestedCategory(request.getSuggestedCategory());
        ticket.setSuggestedPriority(request.getSuggestedPriority());
        ticket.setSuggestedResolutionSteps(request.getSuggestedResolutionSteps());
        ticket.setEstimatedComplexity(request.getEstimatedComplexity());
        ticket.setLlmOverridden(request.getLlmOverridden() != null ? request.getLlmOverridden() : false);
        
        LocalDateTime now = LocalDateTime.now();
        ticket.setCreatedAt(now);
        ticket.setDueAt(slaService.calculateDueDate(request.getPriority(), now));
        
        User assignee = autoAssignmentService.assignTicket(ticket);
        if (assignee != null) {
            ticket.setAssignedTo(assignee);
            ticket.setStatus(Ticket.Status.ASSIGNED);
        }
        
        ticket = ticketRepository.save(ticket);
        
        if (assignee != null) {
            createAuditLog(ticket, "status", "OPEN", "ASSIGNED", user);
            createAuditLog(ticket, "assignedTo", null, assignee.getName(), user);
            notificationService.notifyTicketAssigned(ticket);
        }
        
        notificationService.notifyTicketCreated(ticket);
        
        return ticket;
    }
    
    public Page<Ticket> findTickets(Ticket.Category category, Ticket.Priority priority,
                                    Ticket.Status status, Long assignedTo, Boolean breached,
                                    String search, Pageable pageable) {
        return ticketRepository.findByFilters(category, priority, status, assignedTo, breached, search, pageable);
    }
    
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id).orElse(null);
    }
    
    @Transactional
    public Ticket updateTicket(Long id, Map<String, Object> updates, User user) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket == null) return null;
        
        updates.forEach((field, value) -> {
            String oldValue = getFieldValue(ticket, field);
            
            switch (field) {
                case "status" -> ticket.setStatus(Ticket.Status.valueOf((String) value));
                case "priority" -> ticket.setPriority(Ticket.Priority.valueOf((String) value));
                case "category" -> ticket.setCategory(Ticket.Category.valueOf((String) value));
            }
            
            String newValue = getFieldValue(ticket, field);
            createAuditLog(ticket, field, oldValue, newValue, user);
        });
        
        if (ticket.getStatus() == Ticket.Status.RESOLVED || ticket.getStatus() == Ticket.Status.CLOSED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }
        
        ticketRepository.save(ticket);
        notificationService.notifyStatusChanged(ticket);
        
        return ticket;
    }
    
    public TicketStatsResponse getStats() {
        TicketStatsResponse stats = new TicketStatsResponse();
        
        stats.setTotalTickets(ticketRepository.count());
        stats.setOpenTickets(ticketRepository.countOpenTickets());
        
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        Double avgPerDay = ticketRepository.getAverageTicketsPerDay(thirtyDaysAgo, 30);
        stats.setAvgTicketsPerDay(avgPerDay != null ? avgPerDay : 0.0);
        
        Double breachRate = ticketRepository.getSlaBreachRate();
        stats.setSlaBreachRate(breachRate != null ? breachRate : 0.0);
        
        Double avgResolution = ticketRepository.getAverageResolutionTimeHours();
        stats.setAvgResolutionTimeHours(avgResolution != null ? avgResolution : 0.0);
        
        stats.setPriorityBreakdown(convertToMap(ticketRepository.getPriorityBreakdown()));
        stats.setCategoryBreakdown(convertToMap(ticketRepository.getCategoryBreakdown()));
        
        List<Object[]> workloadData = ticketRepository.getTechnicianWorkload();
        stats.setTechnicianWorkload(workloadData.stream()
            .map(row -> new TicketStatsResponse.TechnicianWorkload(
                (String) row[0],
                ((Number) row[1]).longValue(),
                ((Number) row[2]).longValue()
            ))
            .collect(Collectors.toList()));
        
        Double overrideRate = ticketRepository.getLlmOverrideRate();
        stats.setLlmOverrideRate(overrideRate != null ? overrideRate : 0.0);
        
        return stats;
    }
    
    private Map<String, Long> convertToMap(List<Object[]> data) {
        Map<String, Long> map = new HashMap<>();
        for (Object[] row : data) {
            map.put(row[0].toString(), ((Number) row[1]).longValue());
        }
        return map;
    }
    
    private String getFieldValue(Ticket ticket, String field) {
        return switch (field) {
            case "status" -> ticket.getStatus() != null ? ticket.getStatus().name() : null;
            case "priority" -> ticket.getPriority() != null ? ticket.getPriority().name() : null;
            case "category" -> ticket.getCategory() != null ? ticket.getCategory().name() : null;
            default -> null;
        };
    }
    
    private void createAuditLog(Ticket ticket, String field, String oldValue, String newValue, User user) {
        AuditLog log = new AuditLog();
        log.setTicket(ticket);
        log.setField(field);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);
        log.setChangedBy(user);
        auditLogRepository.save(log);
    }
}
