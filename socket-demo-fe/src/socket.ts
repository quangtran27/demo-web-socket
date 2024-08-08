'use client'

import { io } from 'socket.io-client'

export enum ChatEvent {
  JoinRoom = 'join-room',
  LeaveRoom = 'leave-room',
  SendMessage = 'send-message',
  ReceiveMessage = 'receive-message',
}

export type Message = {
  user?: string
  type: string
  content: string
}

export const socket = io('http://localhost:5001')

export function joinRoom(user: string) {
  socket.emit(ChatEvent.JoinRoom, {
    room: 'chat',
    user,
  })
}

export function leaveRoom() {
  socket.emit(ChatEvent.LeaveRoom, 'chat')
}

export function sendMessage(message: Message) {
  socket.emit(ChatEvent.SendMessage, message)
}
