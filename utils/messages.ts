export function chunkMessagesByAuthor(messages: Map<MessageId, ConversationMessage>): ConversationMessage[][] {
  const messageChunks: ConversationMessage[][] = []

  let lastAuthor: UserId | null = null
  let currentChunk: ConversationMessage[] = []
  for (const message of messages.values()) {
    if (lastAuthor && lastAuthor !== message.sender) {
      messageChunks.push(currentChunk)
      currentChunk = []
    }

    lastAuthor = message.sender
    currentChunk.push(message)
  }

  // Loop will not include last chunk
  if (currentChunk.length > 0) {
    messageChunks.push(currentChunk)
  }

  return messageChunks
}

export function getUserReadTimes(conversation: Conversation, me: UserId | undefined): UserReadTimes {
  const readMap: Record<UserId, Date> = {}
  for (const [id, conversationState] of conversation.members) {
    if (id === me) {
      continue
    }
    readMap[id] = conversationState.lastRead
  }
  return readMap
}

export function getMessageReadList(messageTime: Date, users: Map<UserId, User>, readTimes: UserReadTimes): string[] {
  const readUsers: string[] = []

  for (const id in readTimes) {
    if (readTimes[id].valueOf() >= messageTime.valueOf()) {
      const user = users.get(id)
      if (user) {
        readUsers.push(user.name)
      }
    }
  }

  return readUsers
}
