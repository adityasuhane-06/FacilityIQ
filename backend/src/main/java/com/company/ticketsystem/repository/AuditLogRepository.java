package com.company.ticketsystem.repository;

import com.company.ticketsystem.entity.AuditLog;
import com.company.ticketsystem.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByTicketOrderByChangedAtDesc(Ticket ticket);
}
