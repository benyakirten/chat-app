import { defineStore } from "pinia";

import { arrayify } from '@/lib/collections';
import { ConversationMessage, UserId } from "./messages";

const PROP_USERS = new Map<UserId, User>()
PROP_USERS.set('u1', {
  name: 'Cool Person',
  userId: 'u1',
  state: 'completed',
})
PROP_USERS.set('u2', {
  name: 'Completed User',
  userId: 'u2',
  state: 'completed',
})
PROP_USERS.set('u3', {
  name: 'Pending User',
  userId: 'u3',
  state: 'pending',
})
PROP_USERS.set('u4', {
  name: 'Failed User',
  userId: 'u4',
  state: 'failed',
})

// TODO: Add details for a user
export interface User {
  userId: UserId,
  name: string,
  // TODO: Public keys for others, private key for current user
  // key: string
  // For optimistic updates
  state: "failed" | "pending" | "completed"
  // This may be a reach to add user images
  image?: string
}

// Users can be retrieved individually
// and will probably be batch added
// after the user logs in
export interface UsersStoreState {
  users: Map<UserId, User>,
  me: UserId | null,
}

export const useUsersStore = defineStore("users", () => {
  const users = ref<UsersStoreState['users']>(PROP_USERS)
  const me = ref<UsersStoreState['me']>('u1')

  function addUser(user: User) {
    users.value.set(user.userId, user)
  }

  function batchAddUsers(users: User[]) {
    // TODO: Modify this when we have a backend
    users.forEach(user => addUser(user))
  }

  function updateUser(userId: UserId, user: Partial<User>) {
    const currentUser = users.value.get(userId)
    if (!currentUser) {
      // TODO: Error handling
      return
    }
    users.value.set(userId, { ...currentUser, ...user })
  }

  const isMine = computed(() => (message: ConversationMessage) =>
    me.value === message.userId
  )

  const getOtherUsers = computed(() => (userIds: UserId | UserId[]) =>
    arrayify(userIds).reduce<User[]>((acc, next) => {
      const user = users.value.get(next)
      if (user && user.userId !== me.value) {
        acc.push(user)
      }
      return acc
    }, [])
  )

  return { users, me, getOtherUsers, addUser, batchAddUsers, updateUser, isMine }
})
