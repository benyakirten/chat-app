import { capitalize } from '@/lib/strings'
import { defineStore } from 'pinia'
import { Conversation, useMessageStore } from './messages'
import { useUsersStore } from './users'

export const useTitleStore = defineStore('title', () => {
  const userStore = useUsersStore()
  const messageStore = useMessageStore()

  const conversationSubtitle = computed(() => (conversation?: Conversation) => {
    if (!conversation) {
      return 'Unknown Conversation'
    }

    if (conversation.alias) {
      return conversation.alias
    }

    const otherUsers = userStore.getOtherUsers(conversation.members)
    if (otherUsers.length === 0) {
      return 'Empty Conversation'
    }

    if (otherUsers.length === 1) {
      return otherUsers[0].name
    }

    return `${otherUsers[0].name} and ${otherUsers.length - 1} others`
  })

  // TODO: Clean this the F up
  const title = computed(() => (path: string, id?: string | string[]) => {
    let title = 'Chat App'
    const sections = path.slice(1).split('/')
    if (sections.length === 0) {
      return title
    }

    const pageTitle = capitalize(sections[0])
    title += ` ${pageTitle}`
    if (pageTitle !== 'Chat' || typeof id !== 'string' || !userStore.me) {
      return title
    }

    const conversation = messageStore.conversations.get(id)
    const subpageTitle = conversationSubtitle.value(conversation)
    title += ` - ${subpageTitle}`

    const unreadMessages = messageStore.unreadMessages(conversation)
    if (unreadMessages === 0) {
      return title
    }

    return `(${unreadMessages}) ${title}`
  })

  return { title, conversationSubtitle }
})
