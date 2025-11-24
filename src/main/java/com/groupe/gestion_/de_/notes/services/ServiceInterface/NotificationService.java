package com.groupe.gestion_.de_.notes.services.ServiceInterface;

import com.groupe.gestion_.de_.notes.model.Notification;
import com.groupe.gestion_.de_.notes.model.User;
import java.util.List;

public interface NotificationService {
    Notification createNotification(String title, String message, String type, Long userId);
    List<Notification> getUserNotifications(Long userId);
    List<Notification> getUnreadNotifications(Long userId);
    void markAsRead(Long notificationId);
    void markAllAsRead(Long userId);
    long getUnreadCount(Long userId);
}