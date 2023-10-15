<script setup lang="ts">
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'

// TODO: Add possibility to set an alias
const { loading, invoke } = useLoading((isPrivate: boolean, selected: Set<string>, message: string) => {
  if (isPrivate) {
    const otherUser = getFirstSetItem(selected)
    if (!otherUser) {
      throw new Error('A conversation must involve one other person.')
    }
    return messageStore.startConversation(true, [otherUser], message)
  }
  return messageStore.startConversation(false, [...selected], message)
})

const messageStore = useMessageStore()
const userStore = useUsersStore()
const modalStore = useModalStore()

const selected = ref<Set<string>>(new Set())
const message = ref('')
const isPrivate = ref(true)
const errorMessage = ref<string | null>(null)

// TODO: Replace this with form validation + checking if inputs are touched
const displayedErrorMessage = computed(() => {
  if (errorMessage.value) {
    return errorMessage.value
  }

  if (message.value === '') {
    return 'Messages must not be empty.'
  }

  if (selected.value.size === 0) {
    return 'There must be at least one conversant'
  }

  if (isPrivate.value && selected.value.size > 1) {
    return 'A private conversation can only have one other conversant'
  }

  return null
})

async function handleSubmit() {
  errorMessage.value = null
  const res = await invoke(isPrivate.value, selected.value, message.value)
  if (typeof res === 'string') {
    modalStore.close()
    await navigateTo(`/chat/${res}`)
    return
  }

  errorMessage.value = res.message
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="new">
    <div class="new-first">
      <GeneralInputUserMultiSelect
        :selected="selected"
        @setSelected="selected = $event"
        :options="userStore.allOtherUsers"
      />
      <GeneralInputCheckbox class="new-first-checkbox" v-model="isPrivate">
        <GeneralTooltip direction="left">
          <template #content>Once made, conversations cannot be converted between group and private. </template>
          <span class="new-first-checkbox-label">Private Conversation</span>
        </GeneralTooltip>
      </GeneralInputCheckbox>
    </div>
    <GeneralInputAutosize class="new-autosize" placeholder="Write a message..." label="New Message" v-model="message" />
    <!-- TODO: Add input for alias for group conversations -->
    <div class="new-submit">
      <div class="new-submit-error" v-if="displayedErrorMessage">{{ displayedErrorMessage }}</div>
      <div class="new-submit-icon">
        <GeneralIconButton
          :title="'Send Message'"
          :icon="PaperAirplaneIcon"
          size="2.5rem"
          type="submit"
          :disabled="loading"
          tooltipDirection="left"
        />
      </div>
    </div>
  </form>
</template>

<style scoped>
.new {
  padding: 2rem;
  width: 80vw;

  display: grid;
  row-gap: 4rem;

  @media (width <= 800px) {
    row-gap: 1rem;
  }

  &-first {
    display: flex;
    justify-content: space-between;
    padding-right: 4rem;

    @media (width <= 800px) {
      flex-direction: column;
      gap: 10rem;
    }

    &-checkbox {
      align-self: end;
      padding-bottom: 0.6rem;

      @media (width <= 800px) {
        align-self: start;
      }

      &-label {
        width: max-content;
      }
    }
  }

  &-autosize {
    padding: 0;
  }

  &-submit {
    justify-self: end;

    display: grid;
    grid-template-columns: 1fr 1fr;

    width: 100%;

    &-error {
      justify-self: start;
      color: var(--error-bg);
      grid-column: 1 / 2;
    }

    &-icon {
      grid-column: 2 / -1;
      justify-self: end;
    }
  }
}
</style>
