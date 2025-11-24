import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageApiService } from './message-api.service';

export interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatConversation {
  id: number;
  participantId: number;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private conversationsSubject = new BehaviorSubject<ChatConversation[]>([]);
  
  public messages$ = this.messagesSubject.asObservable();
  public conversations$ = this.conversationsSubject.asObservable();

  constructor(private messageApiService: MessageApiService) {
    this.loadMockData();
    this.loadRealData();
  }

  private loadMockData(): void {
    const mockConversations: ChatConversation[] = [
      {
        id: 1,
        participantId: 2,
        participantName: 'Prof. Martin',
        participantRole: 'Enseignant',
        lastMessage: 'Votre note en mathématiques est disponible',
        lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
        unreadCount: 2
      },
      {
        id: 2,
        participantId: 3,
        participantName: 'Admin Darwin',
        participantRole: 'Administrateur',
        lastMessage: 'Mise à jour du système prévue ce soir',
        lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        unreadCount: 0
      }
    ];

    const mockMessages: ChatMessage[] = [
      {
        id: 1,
        senderId: 2,
        senderName: 'Prof. Martin',
        receiverId: 1,
        message: 'Bonjour, votre note en mathématiques est disponible.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: true
      },
      {
        id: 2,
        senderId: 1,
        senderName: 'Vous',
        receiverId: 2,
        message: 'Merci pour l\'information !',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        read: true
      },
      {
        id: 3,
        senderId: 2,
        senderName: 'Prof. Martin',
        receiverId: 1,
        message: 'N\'hésitez pas si vous avez des questions.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false
      }
    ];

    this.conversationsSubject.next(mockConversations);
    this.messagesSubject.next(mockMessages);
  }

  getConversations(): Observable<ChatConversation[]> {
    return this.conversations$;
  }

  getMessages(conversationId: number): Observable<ChatMessage[]> {
    return this.messages$;
  }

  sendMessage(receiverId: number, message: string): void {
    const newMessage: ChatMessage = {
      id: Date.now(),
      senderId: 1, // Current user
      senderName: 'Vous',
      receiverId,
      message,
      timestamp: new Date(),
      read: false
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, newMessage]);

    // Update conversation
    const conversations = this.conversationsSubject.value.map(conv => 
      conv.participantId === receiverId 
        ? { ...conv, lastMessage: message, lastMessageTime: new Date() }
        : conv
    );
    this.conversationsSubject.next(conversations);
  }

  markAsRead(conversationId: number): void {
    const conversations = this.conversationsSubject.value.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    );
    this.conversationsSubject.next(conversations);
  }

  private loadRealData(): void {
    this.messageApiService.getConversationPartners().subscribe({
      next: (partners) => {
        const conversations = partners.map(partner => ({
          id: partner.id,
          participantId: partner.id,
          participantName: `${partner.firstname} ${partner.lastname}`,
          participantRole: partner.role,
          lastMessage: 'Aucun message',
          lastMessageTime: new Date(),
          unreadCount: 0
        }));
        this.conversationsSubject.next(conversations);
      },
      error: (error) => console.error('Erreur chargement partenaires:', error)
    });
  }

  sendRealMessage(receiverId: number, message: string): void {
    this.messageApiService.sendMessage(receiverId, message).subscribe({
      next: (sentMessage) => {
        const newMessage: ChatMessage = {
          id: sentMessage.id,
          senderId: sentMessage.senderId,
          senderName: 'Vous',
          receiverId: sentMessage.receiverId,
          message: sentMessage.content,
          timestamp: new Date(sentMessage.timestamp),
          read: sentMessage.read
        };
        const currentMessages = this.messagesSubject.value;
        this.messagesSubject.next([...currentMessages, newMessage]);
      },
      error: (error) => console.error('Erreur envoi message:', error)
    });
  }
}