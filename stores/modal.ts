import { defineStore } from 'pinia'
import { ConversationId } from './messages'

interface NewMessageModal {
  type: 'new'
}
interface ModifyConversationModal {
  type: 'modify'
  id: ConversationId
}

type ModalState = NewMessageModal | ModifyConversationModal

export const useModalStore = defineStore('modal', () => {
  const state = ref<ModalState | null>(null)

  function modifyConversation(id: ConversationId) {
    state.value = {
      type: 'modify',
      id,
    }
  }

  function newConversation() {
    state.value = { type: 'new' }
  }

  function close() {
    state.value = null
  }

  return { state, modifyConversation, newConversation, close }
})
