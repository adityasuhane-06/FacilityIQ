package com.company.ticketsystem.repository;

import com.company.ticketsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.role = 'TECHNICIAN' AND u.specialization LIKE %:category%")
    List<User> findTechniciansBySpecialization(String category);
    
    @Query("SELECT u FROM User u WHERE u.role = 'TECHNICIAN'")
    List<User> findAllTechnicians();
    
    @Query("SELECT u FROM User u WHERE u.role = 'MANAGER'")
    List<User> findAllManagers();
}
