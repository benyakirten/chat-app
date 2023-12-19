<script setup lang="ts">
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'

const { loading, invoke } = useLoading((isPrivate: boolean, selected: Set<string>, alias?: string) => {
  if (isPrivate) {
    const otherUser = getFirstSetItem(selected)
    if (!otherUser) {
      throw new Error('A conversation must involve one other person.')
    }
    return messageStore.startPrivateConversation(otherUser)
  }
  return messageStore.startGroupConversation([...selected], alias)
})

const messageStore = useMessageStore()
const userStore = useUsersStore()
const modalStore = useModalStore()
const socketStore = useSocketStore()

const selected = ref<Set<string>>(new Set())
const isPrivate = ref(true)
const errorMessage = ref<string | null>(null)
const multiSelectValid = computed(() => (isPrivate.value ? selected.value.size === 1 : selected.value.size > 0))
const conversationAlias = ref('')

async function handleSubmit() {
  errorMessage.value = null
  const res = await invoke(isPrivate.value, selected.value, conversationAlias.value)
  if (typeof res === 'string') {
    const channelSocketPresent = await retry(() => socketStore.conversationChannels.has(res), 100, 20)
    modalStore.close()

    if (channelSocketPresent) {
      await navigateTo(`/chat/${res}`)
    }

    return
  }

  errorMessage.value = res.message
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="new">
    <GeneralInputUserMultiSelect
      :selected="selected"
      @setSelected="selected = $event"
      :options="userStore.allOtherUsers"
      :error-message="
        isPrivate
          ? 'Only exactly one other participant can be in a private conversation'
          : 'At least one other participant must be in a group conversation'
      "
      :is-valid="multiSelectValid"
    />
    <GeneralInputCheckbox class="new-first-checkbox" v-model="isPrivate">
      <GeneralTooltip direction="left">
        <template #content
          >Encryption is not enabled for group conversations. Once made, conversations cannot be converted between group
          and private.</template
        >
        <span class="new-first-checkbox-label">Private Conversation</span>
      </GeneralTooltip>
    </GeneralInputCheckbox>
    <GeneralInputText v-model="conversationAlias" type="text" v-if="!isPrivate" placeholder="Besties 4eva">
      <template #label>
        <GeneralTooltip direction="left">
          <template #content>The alias will can be changed at any time</template>
          (Optional) Alias for the conversation
        </GeneralTooltip>
      </template>
    </GeneralInputText>
    <div class="new-submit">
      <div class="new-submit-icon">
        <GeneralIconButton
          :title="'Send Message'"
          :icon="PaperAirplaneIcon"
          size="2.5rem"
          type="submit"
          :disabled="loading || !multiSelectValid || message.length === 0"
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
  row-gap: 2rem;

  @media (width <= 800px) {
    row-gap: 1rem;
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
