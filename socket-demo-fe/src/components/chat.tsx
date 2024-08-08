'use client'

import { useEffect, useState } from 'react'

import { ChatEvent, joinRoom, Message, sendMessage, socket } from '@/socket'

export default function Chat() {
  const [isJoined, setIsJoined] = useState(false)
  const [name, setName] = useState('')

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  function submitName(name: string) {
    joinRoom(name)
    setIsJoined(true)
  }

  function handleSendMessage(message: string) {
    console.log(message)

    sendMessage({
      user: name,
      type: 'message',
      content: message,
    })
    setMessage('')
  }

  useEffect(() => {
    socket.on(ChatEvent.ReceiveMessage, (message: Message) => {
      setMessages((prev) => [...prev, message])
    })
  }, [])

  return (
    <div className="m-10 flex flex-col items-start gap-2 rounded-xl border bg-white p-4">
      {!isJoined && (
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={name}
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            className="rounded border p-2"
          />
          <button
            className="rounded-lg bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-600/85"
            onClick={() => submitName(name)}
          >
            Submit
          </button>
        </div>
      )}
      <div className="h-[450px] max-h-[450px] w-full space-y-2">
        {messages.map((message: Message, index: number) =>
          message.type === 'noti' ? (
            <p key={index} className="text-center text-gray-500">
              {message.content}
            </p>
          ) : (
            <div
              key={index}
              className={`${message.user === name ? 'ml-auto' : ''} w-full max-w-[400px] rounded-lg bg-gray-200 p-2`}
            >
              {message.content}
            </div>
          )
        )}
      </div>
      <div className="flex w-full items-center gap-4">
        <input
          type="text"
          placeholder="Enter message"
          className="flex-1 rounded border p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="rounded-lg bg-pink-600 px-5 py-2 text-white transition-colors hover:bg-pink-600/85"
          onClick={() => handleSendMessage(message)}
        >
          Send
        </button>
      </div>
    </div>
  )
}
