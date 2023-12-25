import { defineStore } from 'pinia'
import { z } from 'zod'

import type { ConversationMessage, UserConversationState, UserId } from './messages'
import { PARTIAL_AUTH_SHAPE, USERS_QUERY_SHAPE } from '@/utils/shapes'

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
  theme: 'day' | 'night' | 'auto'
  hidden: boolean
  // TODO: Consider how a block list will work
  block: Set<string>
  token: string
  refreshTimeout: NodeJS.Timeout
}

export type MutableOptions = Omit<Me, 'id'>

export const useUsersStore = defineStore('users', () => {
  const toastStore = useToastStore()
  const messageStore = useMessageStore()
  const recentsStore = useRecentsStore()
  const socketStore = useSocketStore()
  const route = useRoute()

  const token = ref<string | null>(null)
  const search = ref<string>('')
  let searchAbortController = new AbortController()

  const users = ref<Map<UserId, User>>(new Map())
  const me = ref<Me | null>(null)

  function addUser(user: User) {
    users.value.set(user.id, user)
  }

  async function performSearch(searchText: string) {
    if (searchText !== search.value) {
      // This will fire every time that the multiselect is opened if there are only a few options
      // Therefore we only abort the request
      searchAbortController.abort()

      // If the abort controller has called .abort then any request that uses its signal will not
      // complete running forward
      searchAbortController = new AbortController()

      search.value = searchText
      token.value = null
    }

    const { signal } = searchAbortController

    const params = new URLSearchParams()
    params.set('search', search.value)
    if (token.value) {
      params.set('page_token', token.value)
    }

    const res = await useAuthedFetch(`/api/users?${params}`, 'GET', undefined, { signal })
    if (!res.error) {
      toastStore.addErrorToast(res.error, 'Unable to find additional users.')
      return
    }

    const usersResponse = USERS_QUERY_SHAPE.safeParse(res.data.value)
    if (!usersResponse.success) {
      toastStore.addErrorToast(
        res.data.value,
        'Received unexpected shape from server. Unable to find additional users.'
      )
      return
    }

    const { items, page_token } = usersResponse.data.users
    token.value = page_token
    for (const user of items) {
      const internalUser: User = {
        id: user.id,
        name: user.display_name,
        online: false,
      }
      users.value.set(user.id, internalUser)
    }
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
    const res = await useAuthedFetch('/api/profile', 'PATCH', { [option]: value })
    if (res.error.value) {
      toastStore.add(`Unable to update profile: ${res.error.value}`, { type: 'error' })
    }
  }

  async function setHidden(hidden: boolean) {
    if (!me.value) {
      toastStore.addErrorToast(null, 'Unable to change user settings when not logged in')
      return
    }

    me.value.hidden = hidden
    socketStore.transmitHiddenStatusChange(hidden)
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
    users.value.set(data.user.id, {
      name: user.display_name,
      id: user.id,
      online: true,
    })

    const refreshTimeout = setTimeout(() => {
      performRefresh()
    }, REFRESH_TIMEOUT)

    me.value = {
      block: new Set(),
      token: data.auth_token,
      theme: user.theme,
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
      privateKey: null,
      publicKey: null,
    }))

    for (const recent of data.user.recents.toReversed()) {
      recentsStore.visit(recent)
    }

    socketStore.init()
  }

  async function performRefresh() {
    if (!me.value) {
      toastStore.add('Unable to refresh authentication token if you are not logged in.', { type: 'error' })
      return
    }

    const res = await useFetch('/auth/refresh', { method: 'POST' })
    if (res.error.value) {
      toastStore.add('Unable to refresh authentication token. You will be automatically logged out..', {
        type: 'error',
      })
      signout()

      return
    }

    me.value.token = res.data.value.token
    me.value.refreshTimeout = setTimeout(() => {
      performRefresh()
    }, REFRESH_TIMEOUT)
  }

  async function signout() {
    if (me.value) {
      clearTimeout(me.value.refreshTimeout)
      me.value = null
    }

    // Whether or not this succeeds, we want the user to appear logged out
    await useFetch('/auth/signout', { method: 'POST' })

    reset()
    messageStore.reset()
    recentsStore.reset()
    socketStore.disconnect()
    if (!doesNotNeedLogin(route.fullPath)) {
      await navigateTo('/login')
    }
  }

  function setUserOnlineState(userId: UserId, online: boolean) {
    const user = users.value.get(userId)
    if (!user) {
      return
    }

    user.online = online
  }

  function reset() {
    users.value = new Map()
  }

  return {
    users,
    me,
    getOtherUsers,
    addUser,
    updateUser,
    isMine,
    otherUsers,
    userMe,
    allOtherUsers,
    setAccountOption,
    setUserName,
    processAuthData,
    performRefresh,
    signout,
    setUserOnlineState,
    setHidden,
    reset,
    token,
    performSearch,
  }
})
