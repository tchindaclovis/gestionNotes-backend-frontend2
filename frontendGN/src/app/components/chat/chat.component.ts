import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatConversation, ChatMessage } from '../../services/chat.service';
import { AvatarService } from '../../services/avatar.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <div class="chat-trigger" (click)="toggleChat()">
        <div class="chat-icon">
          💬
          <span *ngIf="totalUnread > 0" class="chat-badge">{{ totalUnread }}</span>
        </div>
      </div>

      <div *ngIf="showChat" class="chat-panel">
        <div class="chat-header">
          <h3>Messages</h3>
          <button class="close-btn" (click)="closeChat()">✕</button>
        </div>

        <div *ngIf="!selectedConversation" class="conversations-list">
          <div *ngFor="let conv of conversations" 
               class="conversation-item"
               (click)="selectConversation(conv)">
            
            <div class="conv-content">
              <div class="conv-name">{{ conv.participantName }}</div>
              <p class="conv-last-message">{{ conv.lastMessage }}</p>
            </div>
            
            <div *ngIf="conv.unreadCount > 0" class="unread-count">{{ conv.unreadCount }}</div>
          </div>
        </div>

        <div *ngIf="selectedConversation" class="conversation-view">
          <div class="conversation-header">
            <button class="back-btn" (click)="backToList()">←</button>
            <span>{{ selectedConversation.participantName }}</span>
          </div>

          <div class="messages-container">
            <div *ngFor="let message of filteredMessages" 
                 class="message-item"
                 [class.own-message]="message.senderName === 'Vous'">
              <div class="message-content">
                <div class="message-text">{{ message.message }}</div>
                <div class="message-time">{{ getTimeAgo(message.timestamp) }}</div>
              </div>
            </div>
          </div>

          <div class="message-input">
            <input type="text" 
                   [(ngModel)]="newMessage" 
                   (keyup.enter)="sendMessage()"
                   placeholder="Tapez votre message..."
                   class="input-field">
            <button (click)="sendMessage()" class="send-btn">📤</button>
          </div>
        </div>
      </div>

      <div *ngIf="showChat" class="chat-overlay" (click)="closeChat()"></div>
    </div>
  `,
  styles: [`
    .chat-container { position: relative; }
    .chat-trigger { cursor: pointer; }
    .chat-icon { font-size: 1.5rem; position: relative; }
    .chat-badge { position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; }
    .chat-panel { position: absolute; top: 100%; right: 0; width: 350px; height: 400px; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15); z-index: 1000; display: flex; flex-direction: column; }
    .chat-header { padding: 16px; border-bottom: 1px solid #e0e7ff; display: flex; justify-content: space-between; }
    .conversations-list { flex: 1; overflow-y: auto; }
    .conversation-item { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; cursor: pointer; display: flex; justify-content: space-between; }
    .conversation-item:hover { background: #f8fafc; }
    .conv-name { font-weight: 600; color: #1e40af; }
    .conv-last-message { font-size: 0.8rem; color: #64748b; margin: 4px 0 0 0; }
    .unread-count { background: #3b82f6; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; }
    .conversation-view { flex: 1; display: flex; flex-direction: column; }
    .conversation-header { padding: 12px 16px; border-bottom: 1px solid #e0e7ff; display: flex; align-items: center; gap: 12px; }
    .back-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #3b82f6; }
    .messages-container { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
    .message-item { display: flex; }
    .message-item.own-message { justify-content: flex-end; }
    .message-content { max-width: 70%; background: #f1f5f9; padding: 8px 12px; border-radius: 12px; }
    .own-message .message-content { background: #3b82f6; color: white; }
    .message-text { font-size: 0.9rem; }
    .message-time { font-size: 0.7rem; opacity: 0.7; margin-top: 4px; }
    .message-input { padding: 12px 16px; border-top: 1px solid #e0e7ff; display: flex; gap: 8px; }
    .input-field { flex: 1; padding: 8px 12px; border: 1px solid #e0e7ff; border-radius: 20px; }
    .send-btn { background: #3b82f6; color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; }
    .chat-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999; }
  `]
})
export class ChatComponent implements OnInit {
  showChat = false;
  conversations: ChatConversation[] = [];
  messages: ChatMessage[] = [];
  selectedConversation: ChatConversation | null = null;
  newMessage = '';
  totalUnread = 0;

  constructor(
    private chatService: ChatService,
    private avatarService: AvatarService
  ) {}

  ngOnInit(): void {
    this.chatService.getConversations().subscribe(conversations => {
      this.conversations = conversations;
      this.totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    });

    this.chatService.getMessages(0).subscribe(messages => {
      this.messages = messages;
    });
  }

  get filteredMessages(): ChatMessage[] {
    if (!this.selectedConversation) return [];
    return this.messages.filter(msg => 
      msg.senderId === this.selectedConversation!.participantId || 
      msg.receiverId === this.selectedConversation!.participantId
    );
  }

  toggleChat(): void {
    this.showChat = !this.showChat;
  }

  closeChat(): void {
    this.showChat = false;
    this.selectedConversation = null;
  }

  selectConversation(conv: ChatConversation): void {
    this.selectedConversation = conv;
    this.chatService.markAsRead(conv.id);
  }

  backToList(): void {
    this.selectedConversation = null;
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedConversation) {
      this.chatService.sendMessage(this.selectedConversation.participantId, this.newMessage);
      this.newMessage = '';
    }
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(diff / 86400000)}j`;
  }
}