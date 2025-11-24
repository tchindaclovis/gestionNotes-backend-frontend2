package com.groupe.gestion_.de_.notes.repository;

import com.groupe.gestion_.de_.notes.model.Message;
import com.groupe.gestion_.de_.notes.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    @Query("SELECT m FROM Message m WHERE (m.sender = ?1 AND m.receiver = ?2) OR (m.sender = ?2 AND m.receiver = ?1) ORDER BY m.timestamp")
    List<Message> findConversation(User user1, User user2);
    
    @Query("SELECT DISTINCT CASE WHEN m.sender = ?1 THEN m.receiver ELSE m.sender END FROM Message m WHERE m.sender = ?1 OR m.receiver = ?1")
    List<User> findConversationPartners(User user);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver = ?1 AND m.isRead = false")
    long countUnreadByReceiver(User receiver);
}