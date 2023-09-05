import { capitalize } from "@/lib/strings";
import { defineStore } from "pinia";
import { useMessageStore } from "./messages";
import { useUsersStore } from "./users";

export const useTitleStore = defineStore('title', () => {
  const userStore = useUsersStore()
  const route = useRoute()
  const messageStore = useMessageStore()

  // TODO: Clean this the F up
  const title = computed(() => {
    const sections = route.path.slice(1).split('/')
    if (sections.length === 0) {
      return 'Chat App'
    }

    const pageTitle = capitalize(sections[0])
    if (
      pageTitle !== 'Chat' ||
      (!('id' in route.params && typeof route.params['id'] === "string")) ||
      !userStore.me
    ) {
      return pageTitle
    }

    let subpageTitle: string | null = null
    const conversation = messageStore.conversations.get(route.params['id'])

    // TODO: Make this into a function
    if (conversation) {
      if (conversation.alias) {
        subpageTitle = conversation.alias
      } else {
        const otherUsers = userStore.getOtherUsers(conversation.members)
        if (otherUsers.length === 0) {
          subpageTitle = 'Empty Conversation'
        } else if (otherUsers.length === 1) {
          subpageTitle = otherUsers[0].name
        } else {
          subpageTitle = `${otherUsers[0].name} and ${otherUsers.length - 1} others`
        }
      }
    } else {
      return `${pageTitle} - Unknown Conversation`
    }

    const unreadMessages = messageStore.unreadMessages(conversation)
    if (unreadMessages === 0) {
      return `${pageTitle} - ${subpageTitle}`
    }

    return `(${unreadMessages}) ${pageTitle} - ${subpageTitle}`
  })

  return { title }
})
