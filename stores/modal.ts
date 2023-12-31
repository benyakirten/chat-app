import { defineStore, skipHydrate } from 'pinia'

interface NewMessageModal {
  type: 'new'
}
interface ModifyConversationModal {
  type: 'modify'
  id: ConversationId
}
interface AboutModal {
  type: 'about'
}

type ModalState = NewMessageModal | ModifyConversationModal | AboutModal

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

  function seeAboutModal() {
    state.value = { type: 'about' }
  }

  function close() {
    state.value = null
  }

  return { state: skipHydrate(state), modifyConversation, newConversation, seeAboutModal, close }
})
