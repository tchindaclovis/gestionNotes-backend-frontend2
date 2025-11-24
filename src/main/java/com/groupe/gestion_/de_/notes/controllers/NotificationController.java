package com.groupe.gestion_.de_.notes.controllers;

import com.groupe.gestion_.de_.notes.model.Notification;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.NotificationService;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Map<String, Object> request, Authentication auth) {
        try {
            String username = auth.getName();
            Long userId = userService.findByUsername(username).get().getId();
            Notification notification = notificationService.createNotification(
                (String) request.get("title"),
                (String) request.get("message"),
                (String) request.get("type"),
                userId
            );
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(Authentication auth) {
        try {
            String username = auth.getName();
            Long userId = userService.findByUsername(username).get().getId();
            return ResponseEntity.ok(notificationService.getUserNotifications(userId));
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(Authentication auth) {
        try {
            String username = auth.getName();
            Long userId = userService.findByUsername(username).get().getId();
            return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication auth) {
        try {
            String username = auth.getName();
            Long userId = userService.findByUsername(username).get().getId();
            notificationService.markAllAsRead(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getUnreadCount(Authentication auth) {
        try {
            String username = auth.getName();
            Long userId = userService.findByUsername(username).get().getId();
            return ResponseEntity.ok(notificationService.getUnreadCount(userId));
        } catch (Exception e) {
            return ResponseEntity.ok(0L);
        }
    }
}