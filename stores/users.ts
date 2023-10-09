import { defineStore } from 'pinia'
import { z } from 'zod'

import { ConversationMessage, UserConversationState, UserId } from './messages'
import { PARTIAL_AUTH_SHAPE } from '@/utils/api/shapes'
import { performRefresh } from '@/utils/auth'

// const PROP_USERS = new Map<UserId, User>()
// PROP_USERS.set('u1', {
//   name: 'Cool Person',
//   id: 'u1',
//   online: true,
// })
// PROP_USERS.set('u2', {
//   name: 'Completed User',
//   id: 'u2',
//   online: false,
// })
// PROP_USERS.set('u3', {
//   name: 'Pending User',
//   id: 'u3',
//   online: true,
// })
// PROP_USERS.set('u4', {
//   name: 'Failed User',
//   id: 'u4',
//   online: true,
// })

// TODO: Add details for a user
export interface User {
  id: UserId
  name: string
  online: boolean
  // This may be a reach to add user images
  image?: string
}

export interface Me {
  id: UserId
  email: string
  magnification: number
  colorTheme: 'day' | 'night' | 'auto'
  hidden: boolean
  // TODO: Consider how a block list will work
  block: Set<string>
  token: string
  refreshTimeout: NodeJS.Timeout
}

export type MutableOptions = Omit<Me, 'id'>

// Users can be retrieved individually
// and will probably be batch added
// after the user logs in
export interface UsersStoreState {
  users: Map<UserId, User>
  me: Me | null
}

export const useUsersStore = defineStore('users', () => {
  const toastStore = useToastStore()
  const messageStore = useMessageStore()

  const users = ref<UsersStoreState['users']>(new Map())
  const me = ref<UsersStoreState['me']>(null)

  function addUser(user: User) {
    users.value.set(user.id, user)
  }

  function batchAddUsers(users: User[]) {
    // TODO: Modify this when we have a backend
    users.forEach((user) => addUser(user))
  }

  function updateUser(id: UserId, user: Partial<User>) {
    const currentUser = users.value.get(id)
    if (!currentUser) {
      toastStore.add('Unable to update user', { type: 'error' })
      return
    }
    users.value.set(id, { ...currentUser, ...user })
  }

  const isMine = computed(() => (message: ConversationMessage) => me.value?.id === message.sender)

  const getOtherUsers = computed(() => (userStates: Map<UserId, UserConversationState>) => {
    const userList: User[] = []
    for (const id of userStates.keys()) {
      if (id === me.value?.id) {
        continue
      }

      const user = users.value.get(id)
      if (!user) {
        continue
      }

      userList.push(user)
    }

    return userList
  })

  const otherUsers = computed(() => {
    const userList: User[] = []
    for (const [id, user] of users.value) {
      if (id !== me.value?.id) {
        userList.push(user)
      }
    }

    return userList
  })

  async function setAccountOption<T extends keyof MutableOptions>(option: T, value: MutableOptions[T]) {
    if (!me.value) {
      toastStore.add('Unable to change user settings when not logged in', { type: 'error' })
      return
    }

    // Not sure why the type isn't narrowing
    me.value[option] = value as any
    // TODO: Transmit details
  }

  async function setUserName(name: string) {
    // TODO: Add restrictions on usernames - when we have authentication we will add this

    if (!name) {
      toastStore.add('Unable to set username to blank strings', { type: 'error' })
      return
    }

    if (!me.value) {
      return
    }

    const user = users.value.get(me.value.id)
    if (!user) {
      toastStore.add('Unable to change username', { type: 'error' })
      return
    }

    user.name = name
  }

  const userMe = computed(() => users.value.get(me.value?.id ?? ''))

  const allOtherUsers = computed(() => {
    const otherUsers: User[] = []
    for (const [id, user] of users.value) {
      if (id === me.value?.id) {
        continue
      }

      otherUsers.push(user)
    }

    return otherUsers
  })

  function processAuthData(data: z.infer<typeof PARTIAL_AUTH_SHAPE>) {
    for (const user of data.users) {
      users.value.set(user.id, {
        id: user.id,
        name: user.display_name,
        online: false,
      })
    }

    const { user } = data
    const refreshTimeout = setTimeout(() => {
      performRefresh()
    }, REFRESH_TIMEOUT)
    me.value = {
      block: new Set(),
      token: data.auth_token,
      colorTheme: user.theme,
      id: user.id,
      magnification: user.magnification,
      email: user.email,
      hidden: user.hidden,
      refreshTimeout,
    }

    messageStore.conversations = data.conversations.map((conversation) => ({
      id: conversation.id,
      members: new Map(),
      messages: new Map(),
      isPrivate: conversation.private,
      alias: conversation.alias,
    }))
  }

  return {
    users,
    me,
    getOtherUsers,
    addUser,
    batchAddUsers,
    updateUser,
    isMine,
    otherUsers,
    userMe,
    allOtherUsers,
    setAccountOption,
    setUserName,
    processAuthData,
  }
})
