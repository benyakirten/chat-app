import { defineStore } from 'pinia'

import { ConversationMessage, UserConversationState, UserId } from './messages'

const PROP_USERS = new Map<UserId, User>()
PROP_USERS.set('u1', {
  name: 'Cool Person',
  id: 'u1',
  online: true,
})
PROP_USERS.set('u2', {
  name: 'Completed User',
  id: 'u2',
  online: false,
})
PROP_USERS.set('u3', {
  name: 'Pending User',
  id: 'u3',
  online: true,
})
PROP_USERS.set('u4', {
  name: 'Failed User',
  id: 'u4',
  online: true,
})

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
  textSizeMagnification: number
  // TODO: Other accessibility options
  colorTheme: 'day' | 'night' | 'auto'
  // TODO: Other customization options
  hidden: boolean
}

export type MutableMeOption = keyof Omit<Me, 'id'> | 'name'

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
    hidden: false,
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

  async function setMyOptions(option: MutableMeOption, value: string) {
    if (!me.value) {
      toastStore.add('You must be logged in to change your options', { type: 'error' })
      return
    }

    if (option === 'textSizeMagnification') {
      return setTextMagnification(value)
    }

    if (option === 'colorTheme') {
      return setTextTheme(value)
    }

    return setMyName(value)
  }

  async function setTextMagnification(size: string) {
    const val = parseInt(size) / 100
    if (isNaN(val)) {
      toastStore.add('Unable to change text size', { type: 'error' })
      return
    }

    if (!me.value) {
      return
    }

    // TODO: Save text magnification to backend
    me.value.textSizeMagnification = val
  }

  async function setTextTheme(newValue: string) {
    if (newValue !== 'auto' && newValue !== 'day' && newValue !== 'night') {
      toastStore.add('Theme choice must either be auto, day or night', { type: 'error' })
      return
    }

    if (!me.value) {
      return
    }

    // TODO: Send color theme to backend
    me.value.colorTheme = newValue
  }

  async function setMyName(name: string) {
    if (!name || !me.value) {
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

  return { users, me, getOtherUsers, addUser, batchAddUsers, updateUser, isMine, otherUsers, setMyOptions, userMe }
})
