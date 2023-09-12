import { defineStore } from 'pinia'

import { ConversationMessage, UserConversationState, UserId } from './messages'

const PROP_USERS = new Map<UserId, User>()
PROP_USERS.set('u1', {
  name: 'Cool Person',
  id: 'u1',
})
PROP_USERS.set('u2', {
  name: 'Completed User',
  id: 'u2',
})
PROP_USERS.set('u3', {
  name: 'Pending User',
  id: 'u3',
})
PROP_USERS.set('u4', {
  name: 'Failed User',
  id: 'u4',
})

// TODO: Add details for a user
export interface User {
  id: UserId
  name: string
  // This may be a reach to add user images
  image?: string
}

export interface Me {
  id: UserId
  // Value between 0-2 where text will be displayed at (text size) * magnification
  textSizeMagnification: number
  // TODO: Other accessibility options - minor preferences
  colorTheme: 'day' | 'night' | 'auto'
  // TODO: Other customization options
}

// Users can be retrieved individually
// and will probably be batch added
// after the user logs in
export interface UsersStoreState {
  users: Map<UserId, User>
  me: Me | null
}

export const useUsersStore = defineStore('users', () => {
  const toastStore = useToastStore()

  const users = ref<UsersStoreState['users']>(PROP_USERS)
  const me = ref<UsersStoreState['me']>({
    id: 'u1',
    colorTheme: 'night',
    textSizeMagnification: 1,
  })

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

  return { users, me, getOtherUsers, addUser, batchAddUsers, updateUser, isMine, otherUsers }
})
