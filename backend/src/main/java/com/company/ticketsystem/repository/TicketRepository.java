package com.company.ticketsystem.repository;

import com.company.ticketsystem.entity.Ticket;
import com.company.ticketsystem.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT t FROM Ticket t WHERE " +
            "(:category IS NULL OR t.category = :category) AND " +
            "(:priority IS NULL OR t.priority = :priority) AND " +
            "(:status IS NULL OR t.status = :status) AND " +
            "(:assignedTo IS NULL OR t.assignedTo.id = :assignedTo) AND " +
            "(:breached IS NULL OR (:breached = true AND t.breachedAt IS NOT NULL) OR (:breached = false AND t.breachedAt IS NULL)) AND "
            +
            "(:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Ticket> findByFilters(
            @Param("category") Ticket.Category category,
            @Param("priority") Ticket.Priority priority,
            @Param("status") Ticket.Status status,
            @Param("assignedTo") Long assignedTo,
            @Param("breached") Boolean breached,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.assignedTo = :user AND t.status NOT IN ('RESOLVED', 'CLOSED')")
    long countOpenTicketsByAssignee(User user);

    @Query("SELECT t FROM Ticket t WHERE t.dueAt < :now AND t.status NOT IN ('RESOLVED', 'CLOSED') AND t.breachedAt IS NULL")
    List<Ticket> findBreachedTickets(LocalDateTime now);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status IN ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'ESCALATED')")
    long countOpenTickets();

    @Query(value = "SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600.0) FROM tickets WHERE resolved_at IS NOT NULL", nativeQuery = true)
    Double getAverageResolutionTimeHours();

    @Query(value = "SELECT COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM tickets), 0) FROM tickets WHERE breached_at IS NOT NULL", nativeQuery = true)
    Double getSlaBreachRate();

    @Query("SELECT t.priority, COUNT(t) FROM Ticket t GROUP BY t.priority")
    List<Object[]> getPriorityBreakdown();

    @Query("SELECT t.category, COUNT(t) FROM Ticket t GROUP BY t.category")
    List<Object[]> getCategoryBreakdown();

    @Query("SELECT u.name, COUNT(t), SUM(CASE WHEN t.breachedAt IS NOT NULL THEN 1 ELSE 0 END) " +
            "FROM Ticket t JOIN t.assignedTo u " +
            "WHERE t.status NOT IN ('RESOLVED', 'CLOSED') " +
            "GROUP BY u.id, u.name")
    List<Object[]> getTechnicianWorkload();

    @Query(value = "SELECT COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM tickets), 0) FROM tickets WHERE llm_overridden = true", nativeQuery = true)
    Double getLlmOverrideRate();

    @Query(value = "SELECT COUNT(*) * 1.0 / :days FROM tickets WHERE created_at >= :since", nativeQuery = true)
    Double getAverageTicketsPerDay(@Param("since") LocalDateTime since, @Param("days") long days);
}
