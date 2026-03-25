package com.company.ticketsystem.controller;

import com.company.ticketsystem.dto.*;
import com.company.ticketsystem.entity.Ticket;
import com.company.ticketsystem.entity.User;
import com.company.ticketsystem.service.GeminiService;
import com.company.ticketsystem.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {
    
    private final TicketService ticketService;
    private final GeminiService geminiService;
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Ticket> createTicket(@Valid @RequestBody CreateTicketRequest request,
                                            @AuthenticationPrincipal User user) {
        Ticket ticket = ticketService.createTicket(request, user);
        return ApiResponse.success(ticket, "Ticket created successfully");
    }
    
    @GetMapping
    public ApiResponse<Page<Ticket>> listTickets(
            @RequestParam(required = false) Ticket.Category category,
            @RequestParam(required = false) Ticket.Priority priority,
            @RequestParam(required = false) Ticket.Status status,
            @RequestParam(required = false) Long assignedTo,
            @RequestParam(required = false) Boolean breached,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Ticket> tickets = ticketService.findTickets(category, priority, status, assignedTo, breached, search, pageRequest);
        return ApiResponse.success(tickets);
    }
    
    @GetMapping("/{id}")
    public ApiResponse<Ticket> getTicket(@PathVariable Long id) {
        Ticket ticket = ticketService.getTicketById(id);
        if (ticket == null) {
            return ApiResponse.error("Ticket not found");
        }
        return ApiResponse.success(ticket);
    }
    
    @PatchMapping("/{id}")
    public ApiResponse<Ticket> updateTicket(@PathVariable Long id,
                                            @RequestBody Map<String, Object> updates,
                                            @AuthenticationPrincipal User user) {
        Ticket ticket = ticketService.updateTicket(id, updates, user);
        if (ticket == null) {
            return ApiResponse.error("Ticket not found");
        }
        return ApiResponse.success(ticket, "Ticket updated successfully");
    }
    
    @GetMapping("/stats")
    public ApiResponse<TicketStatsResponse> getStats() {
        TicketStatsResponse stats = ticketService.getStats();
        return ApiResponse.success(stats);
    }
    
    @PostMapping("/classify")
    public ApiResponse<ClassificationResponse> classifyTicket(@RequestBody ClassificationRequest request) {
        ClassificationResponse classification = geminiService.classifyTicket(request.getDescription());
        
        if (classification == null) {
            return ApiResponse.success(null, "Classification service unavailable");
        }
        
        return ApiResponse.success(classification);
    }
}
