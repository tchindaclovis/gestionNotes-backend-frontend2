package com.groupe.gestion_.de_.notes.controllers;

import com.groupe.gestion_.de_.notes.model.Message;
import com.groupe.gestion_.de_.notes.model.User;
import com.groupe.gestion_.de_.notes.repository.MessageRepository;
import com.groupe.gestion_.de_.notes.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Map<String, Object> request, Authentication auth) {
        Long senderId = Long.parseLong(auth.getName());
        Long receiverId = Long.parseLong(request.get("receiverId").toString());
        String content = (String) request.get("content");
        
        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();
        
        Message message = new Message(content, sender, receiver);
        return ResponseEntity.ok(messageRepository.save(message));
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<Message>> getConversation(@PathVariable Long userId, Authentication auth) {
        Long currentUserId = Long.parseLong(auth.getName());
        User currentUser = userRepository.findById(currentUserId).orElseThrow();
        User otherUser = userRepository.findById(userId).orElseThrow();
        
        return ResponseEntity.ok(messageRepository.findConversation(currentUser, otherUser));
    }

    @GetMapping("/partners")
    public ResponseEntity<List<User>> getConversationPartners(Authentication auth) {
        Long userId = Long.parseLong(auth.getName());
        User user = userRepository.findById(userId).orElseThrow();
        
        return ResponseEntity.ok(messageRepository.findConversationPartners(user));
    }
}