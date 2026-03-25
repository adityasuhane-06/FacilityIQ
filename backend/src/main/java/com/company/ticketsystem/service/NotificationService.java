package com.company.ticketsystem.service;

import com.company.ticketsystem.entity.Notification;
import com.company.ticketsystem.entity.Ticket;
import com.company.ticketsystem.entity.User;
import com.company.ticketsystem.repository.NotificationRepository;
import com.company.ticketsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    public void notifyTicketCreated(Ticket ticket) {
        List<User> managers = userRepository.findAllManagers();
        String message = String.format("New ticket #%d created: %s", ticket.getId(), ticket.getTitle());
        
        for (User manager : managers) {
            createAndSendNotification(manager, message, ticket);
        }
    }
    
    public void notifyTicketAssigned(Ticket ticket) {
        if (ticket.getAssignedTo() != null) {
            String message = String.format("Ticket #%d assigned to you: %s", ticket.getId(), ticket.getTitle());
            createAndSendNotification(ticket.getAssignedTo(), message, ticket);
        }
    }
    
    public void notifyStatusChanged(Ticket ticket) {
        String message = String.format("Ticket #%d status changed to %s", ticket.getId(), ticket.getStatus());
        
        createAndSendNotification(ticket.getRaisedBy(), message, ticket);
        
        List<User> managers = userRepository.findAllManagers();
        for (User manager : managers) {
            createAndSendNotification(manager, message, ticket);
        }
    }
    
    public void notifySLABreach(Ticket ticket) {
        List<User> managers = userRepository.findAllManagers();
        String message = String.format("SLA BREACH: Ticket #%d - %s", ticket.getId(), ticket.getTitle());
        
        for (User manager : managers) {
            createAndSendNotification(manager, message, ticket);
        }
    }
    
    public void notifyCommentAdded(Ticket ticket, User commenter) {
        String message = String.format("%s commented on ticket #%d", commenter.getName(), ticket.getId());
        
        if (ticket.getAssignedTo() != null && !ticket.getAssignedTo().equals(commenter)) {
            createAndSendNotification(ticket.getAssignedTo(), message, ticket);
        }
        
        if (!ticket.getRaisedBy().equals(commenter)) {
            createAndSendNotification(ticket.getRaisedBy(), message, ticket);
        }
    }
    
    private void createAndSendNotification(User user, String message, Ticket ticket) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setTicket(ticket);
        notificationRepository.save(notification);
        
        try {
            messagingTemplate.convertAndSendToUser(
                user.getEmail(),
                "/queue/notifications",
                notification
            );
        } catch (Exception e) {
            log.error("Failed to send WebSocket notification to user {}: {}", user.getEmail(), e.getMessage());
        }
    }
}
