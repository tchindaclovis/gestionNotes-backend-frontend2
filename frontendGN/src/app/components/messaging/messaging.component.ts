import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatConversation, ChatMessage } from '../../services/chat.service';
import { AvatarService } from '../../services/avatar.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="messaging-container">
      <div class="messaging-layout">
        <!-- Liste des conversations -->
        <div class="conversations-panel">
          <div class="panel-header">
            <h3>💬 Conversations</h3>
            <button class="new-chat-btn" (click)="openNewChatModal()">➕</button>
          </div>
          
          <div class="conversations-list">
            <div *ngFor="let conv of conversations" 
                 class="conversation-card"
                 [class.active]="selectedConversation?.id === conv.id"
                 (click)="selectConversation(conv)">
              
              <div class="conv-avatar">
                <img [src]="getAvatar(conv.participantName)" [alt]="conv.participantName">
                <div *ngIf="conv.unreadCount > 0" class="online-indicator"></div>
              </div>
              
              <div class="conv-info">
                <div class="conv-header">
                  <span class="conv-name">{{ conv.participantName }}</span>
                  <span class="conv-time">{{ getTimeAgo(conv.lastMessageTime) }}</span>
                </div>
                <div class="conv-preview">
                  <span class="conv-role">{{ conv.participantRole }}</span>
                  <p class="last-message">{{ conv.lastMessage }}</p>
                </div>
              </div>
              
              <div *ngIf="conv.unreadCount > 0" class="unread-badge">{{ conv.unreadCount }}</div>
            </div>
          </div>
        </div>

        <!-- Zone de chat -->
        <div class="chat-panel">
          <div *ngIf="!selectedConversation" class="no-conversation">
            <div class="empty-state">
              <span class="empty-icon">💬</span>
              <h3>Sélectionnez une conversation</h3>
              <p>Choisissez une conversation dans la liste pour commencer à discuter</p>
            </div>
          </div>

          <div *ngIf="selectedConversation" class="active-chat">
            <!-- Header du chat -->
            <div class="chat-header">
              <div class="chat-participant">
                <img [src]="getAvatar(selectedConversation.participantName)" [alt]="selectedConversation.participantName">
                <div class="participant-info">
                  <h4>{{ selectedConversation.participantName }}</h4>
                  <span class="participant-role">{{ selectedConversation.participantRole }}</span>
                </div>
              </div>
              <div class="chat-actions">
                <button class="action-btn">📞</button>
                <button class="action-btn">📹</button>
                <button class="action-btn">ℹ️</button>
              </div>
            </div>

            <!-- Messages -->
            <div class="messages-area">
              <div *ngFor="let message of filteredMessages" 
                   class="message-wrapper"
                   [class.own-message]="message.senderName === 'Vous'">
                
                <div class="message-bubble">
                  <div class="message-content">{{ message.message }}</div>
                  <div class="message-meta">
                    <span class="message-time">{{ getTimeAgo(message.timestamp) }}</span>
                    <span *ngIf="message.senderName === 'Vous'" class="message-status">✓</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Zone de saisie -->
            <div class="message-composer">
              <div class="composer-tools">
                <button class="tool-btn">📎</button>
                <button class="tool-btn" (click)="toggleEmojiPicker()">😊</button>
              </div>
              <div class="input-area">
                <div class="emoji-picker" *ngIf="showEmojiPicker">
                  <div class="emoji-grid">
                    <button *ngFor="let emoji of emojis" 
                            class="emoji-btn" 
                            (click)="addEmoji(emoji)">{{ emoji }}</button>
                  </div>
                </div>
                <input type="text" 
                       [(ngModel)]="newMessage" 
                       (keyup.enter)="sendMessage()"
                       placeholder="Tapez votre message..."
                       class="message-input">
                <button (click)="sendMessage()" 
                        [disabled]="!newMessage.trim()" 
                        class="send-button">
                  🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nouvelle Conversation -->
    <div *ngIf="showNewChatModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Nouvelle Conversation</h3>
        
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <div *ngFor="let user of availableUsers" 
               class="flex items-center p-3 hover:bg-gray-50 rounded cursor-pointer"
               (click)="startConversation(user)">
            <img [src]="getAvatar(user.firstname + ' ' + user.lastname)" 
                 class="w-10 h-10 rounded-full mr-3" 
                 [alt]="user.firstname + ' ' + user.lastname">
            <div class="flex-1">
              <div class="font-medium text-gray-900">{{ user.firstname }} {{ user.lastname }}</div>
              <div class="text-sm text-gray-500">{{ user.role }}</div>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <button (click)="closeNewChatModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Annuler
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .messaging-container {
      height: calc(100vh - 200px);
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);
    }

    .messaging-layout {
      display: flex;
      height: 100%;
    }

    /* Panel des conversations */
    .conversations-panel {
      width: 350px;
      border-right: 1px solid #e0e7ff;
      display: flex;
      flex-direction: column;
    }

    .panel-header {
      padding: 20px;
      border-bottom: 1px solid #e0e7ff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
    }

    .panel-header h3 {
      margin: 0;
      color: #1e40af;
      font-size: 1.1rem;
    }

    .new-chat-btn {
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .conversations-list {
      flex: 1;
      overflow-y: auto;
    }

    .conversation-card {
      display: flex;
      padding: 16px 20px;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .conversation-card:hover {
      background: #f8fafc;
    }

    .conversation-card.active {
      background: #eff6ff;
      border-right: 3px solid #3b82f6;
    }

    .conv-avatar {
      position: relative;
      margin-right: 12px;
    }

    .conv-avatar img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }

    .online-indicator {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      background: #10b981;
      border: 2px solid white;
      border-radius: 50%;
    }

    .conv-info {
      flex: 1;
      min-width: 0;
    }

    .conv-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .conv-name {
      font-weight: 600;
      color: #1e40af;
      font-size: 0.95rem;
    }

    .conv-time {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .conv-preview {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .conv-role {
      font-size: 0.7rem;
      color: #64748b;
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
      width: fit-content;
    }

    .last-message {
      font-size: 0.85rem;
      color: #64748b;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .unread-badge {
      position: absolute;
      top: 12px;
      right: 16px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 600;
    }

    /* Panel de chat */
    .chat-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .no-conversation {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-state {
      text-align: center;
      color: #64748b;
    }

    .empty-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 16px;
    }

    .active-chat {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .chat-header {
      padding: 16px 20px;
      border-bottom: 1px solid #e0e7ff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
    }

    .chat-participant {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .chat-participant img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .participant-info h4 {
      margin: 0;
      color: #1e40af;
      font-size: 1rem;
    }

    .participant-role {
      font-size: 0.8rem;
      color: #64748b;
    }

    .chat-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      background: none;
      border: 1px solid #e0e7ff;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: #f1f5f9;
    }

    .messages-area {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message-wrapper {
      display: flex;
    }

    .message-wrapper.own-message {
      justify-content: flex-end;
    }

    .message-bubble {
      max-width: 70%;
      background: #f1f5f9;
      padding: 12px 16px;
      border-radius: 18px;
      border-bottom-left-radius: 4px;
    }

    .own-message .message-bubble {
      background: #3b82f6;
      color: white;
      border-radius: 18px;
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 18px;
    }

    .message-content {
      font-size: 0.9rem;
      line-height: 1.4;
      margin-bottom: 4px;
    }

    .message-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.7rem;
      opacity: 0.7;
    }

    .message-composer {
      padding: 16px 20px;
      border-top: 1px solid #e0e7ff;
      background: #f8fafc;
    }

    .composer-tools {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .tool-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .tool-btn:hover {
      background: #e2e8f0;
    }

    .input-area {
      display: flex;
      gap: 12px;
      align-items: center;
      position: relative;
    }

    .message-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #e0e7ff;
      border-radius: 24px;
      font-size: 0.9rem;
      background: white;
    }

    .message-input:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .send-button {
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      cursor: pointer;
      font-size: 1.1rem;
      transition: all 0.2s;
    }

    .send-button:hover:not(:disabled) {
      background: #2563eb;
      transform: scale(1.05);
    }

    .send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .emoji-picker {
      position: absolute;
      bottom: 100%;
      left: 0;
      background: white;
      border: 1px solid #e0e7ff;
      border-radius: 8px;
      padding: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      z-index: 10;
    }

    .emoji-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 4px;
      max-width: 200px;
    }

    .emoji-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .emoji-btn:hover {
      background: #f1f5f9;
    }
  `]
})
export class MessagingComponent implements OnInit {
  conversations: ChatConversation[] = [];
  messages: ChatMessage[] = [];
  selectedConversation: ChatConversation | null = null;
  newMessage = '';
  showNewChatModal = false;
  availableUsers: any[] = [];
  showEmojiPicker = false;
  emojis = ['😀', '😂', '😍', '🥰', '😊', '😎', '🤔', '😢', '😡', '👍', '👎', '❤️', '🔥', '💯', '🎉', '👏', '🙏', '💪', '🤝', '✨'];

  constructor(
    private chatService: ChatService,
    private avatarService: AvatarService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chatService.getConversations().subscribe(conversations => {
      this.conversations = conversations;
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

  selectConversation(conv: ChatConversation): void {
    this.selectedConversation = conv;
    this.chatService.markAsRead(conv.id);
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedConversation) {
      this.chatService.sendMessage(this.selectedConversation.participantId, this.newMessage);
      this.newMessage = '';
    }
  }

  getAvatar(name: string): string {
    const parts = name.split(' ');
    return this.avatarService.generateAvatar(parts[0] || 'U', parts[1] || 'ser');
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

  openNewChatModal(): void {
    this.showNewChatModal = true;
    this.loadAvailableUsers();
  }

  closeNewChatModal(): void {
    this.showNewChatModal = false;
  }

  loadAvailableUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const currentUser = this.authService.getCurrentUser();
        this.availableUsers = users.filter(user => user.id !== currentUser?.user.id);
      },
      error: (error) => console.error('Erreur chargement utilisateurs:', error)
    });
  }

  startConversation(user: any): void {
    const newConv: ChatConversation = {
      id: Date.now(),
      participantId: user.id,
      participantName: `${user.firstname} ${user.lastname}`,
      participantRole: user.role,
      lastMessage: 'Nouvelle conversation',
      lastMessageTime: new Date(),
      unreadCount: 0
    };
    this.conversations.unshift(newConv);
    this.selectConversation(newConv);
    this.closeNewChatModal();
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(emoji: string): void {
    this.newMessage += emoji;
    this.showEmojiPicker = false;
  }
}