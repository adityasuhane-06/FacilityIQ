package com.company.ticketsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketStatsResponse {
    private long totalTickets;
    private long openTickets;
    private double avgTicketsPerDay;
    private double slaBreachRate;
    private double avgResolutionTimeHours;
    private Map<String, Long> priorityBreakdown;
    private Map<String, Long> categoryBreakdown;
    private List<TechnicianWorkload> technicianWorkload;
    private double llmOverrideRate;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TechnicianWorkload {
        private String name;
        private long openTickets;
        private long breachedTickets;
    }
}
