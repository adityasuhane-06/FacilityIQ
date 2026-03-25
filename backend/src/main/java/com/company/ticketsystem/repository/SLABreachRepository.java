package com.company.ticketsystem.repository;

import com.company.ticketsystem.entity.SLABreach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SLABreachRepository extends JpaRepository<SLABreach, Long> {
}
