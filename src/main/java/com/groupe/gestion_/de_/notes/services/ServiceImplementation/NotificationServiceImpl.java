package com.groupe.gestion_.de_.notes.services.ServiceImplementation;

import com.groupe.gestion_.de_.notes.model.Notification;
import com.groupe.gestion_.de_.notes.model.NotificationType;
import com.groupe.gestion_.de_.notes.model.User;
import com.groupe.gestion_.de_.notes.repository.NotificationRepository;
import com.groupe.gestion_.de_.notes.repository.UserRepository;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public Notification createNotification(String title, String message, String type, Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        Notification notification = new Notification(title, message, 
            NotificationType.valueOf(type.toUpperCase()), user);
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getUserNotifications(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return notificationRepository.findByUserOrderByTimestampDesc(user);
    }

    @Override
    public List<Notification> getUnreadNotifications(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return notificationRepository.findByUserAndIsReadFalseOrderByTimestampDesc(user);
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow();
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<Notification> notifications = notificationRepository.findByUserAndIsReadFalseOrderByTimestampDesc(user);
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Override
    public long getUnreadCount(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return notificationRepository.countUnreadByUser(user);
    }
}