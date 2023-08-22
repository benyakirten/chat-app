import { defineStore } from "pinia";

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
}

// Users can be retrieved individually
// and will probably be batch added
// after the user logs in
export interface UsersStoreState {
  users: Map<UserId, User>,
  me: UserId | null,
}

export const useUsersStore = defineStore("users", {
  state: (): UsersStoreState => ({
    users: PROP_USERS,
    me: 'u1',
  }),
  actions: {
    batchAddUsers(users: User[]) {
      users.forEach(user => this.addUser(user))
    },
    addUser(user: User) {
      this.users.set(user.userId, user)
    },
    updateUser(userId: UserId, user: Partial<User>) {
      const currentUser = this.users.get(userId)
      if (!currentUser) {
        // TODO: Error handling
        return
      }
      this.users.set(userId, { ...currentUser, ...user })
    }
  },
  getters: {
    byId: (state) => (userId: UserId) => {
      let user = state.users.get(userId)
      if (!user) {
        user = {
          name: "Unknown",
          userId,
          state: "pending"
        }
        state.users.set(userId, user)
        // Make API request for user and have it update the state.users map
      }

      return user
    },
    isMine: (state) => (message: ConversationMessage) => state.me === message.userId
  }
})
