package com.groupe.gestion_.de_.notes.repository;

import com.groupe.gestion_.de_.notes.model.Notification;
import com.groupe.gestion_.de_.notes.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserOrderByTimestampDesc(User user);
    
    List<Notification> findByUserAndIsReadFalseOrderByTimestampDesc(User user);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = ?1 AND n.isRead = false")
    long countUnreadByUser(User user);
}