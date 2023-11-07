<script setup lang="ts">
import { PaperAirplaneIcon, PowerIcon } from '@heroicons/vue/24/solid'

const messageStore = useMessageStore()
const userStore = useUsersStore()
const toastStore = useToastStore()
const modalStore = useModalStore()
const route = useRoute()

const props = defineProps<{ conversationId: ConversationId | null }>()

const conversation = computed(() => messageStore.conversation(props.conversationId ?? ''))

const alias = ref('')
watch(conversation, (val) => (alias.value = val?.alias ?? ''))

const submit = useLoading((conversation: Conversation, users: Set<string>, alias: string) =>
  messageStore.modifyConversation(conversation, users, alias)
)
const leave = useLoading((conversation: Conversation) => messageStore.leaveConversation(conversation))

const newUsers = ref<Set<string>>(new Set())

async function handleSubmit() {
  if (!conversation.value) {
    // Shouldn't be possible
    return
  }

  const res = await submit.invoke(conversation.value, newUsers.value, alias.value)
  newUsers.value = new Set()
  modalStore.close()

  if (res instanceof Error) {
    toastStore.add(res.message, { type: 'error' })
  }
}

async function leaveConversation() {
  if (!conversation.value) {
    // TODO: Error handling
    return
  }
  leave.invoke(conversation.value)
  modalStore.close()
  await navigateTo('/chat')
}

const userOptions = computed(() =>
  [...userStore.users.values()].filter(
    (user) => user.id !== userStore.me?.id && !conversation.value?.members.has(user.id)
  )
)
</script>

<template>
  <div class="modify">
    <div class="modify-error" v-if="!conversation || conversation.isPrivate">
      Unable to modify the conversation. Please check that the conversation exists and is not private.
    </div>
    <form class="modify-form" v-else @submit.prevent="handleSubmit">
      <div class="modify-form-first">
        <div class="modify-form-first-multiselect">
          <div class="modify-form-first-multiselect-noone" v-if="!conversation">
            There is no one in this conversation.
          </div>
          <div class="modify-form-first-multiselect-users" v-else>
            <span>Current users:</span>
            <span v-for="id in conversation.members.keys()" :key="id">
              {{ userStore.users.get(id)?.name ?? 'Unknown User' }}
            </span>
          </div>
          <GeneralInputUserMultiSelect
            :options="userOptions"
            :selected="newUsers"
            :is-new-conversation="false"
            @setSelected="newUsers = $event"
          />
        </div>
        <div class="modify-form-first-alias">
          <GeneralInputText v-model="alias" placeholder="Choose a nickname...">
            <template #label>
              <GeneralTooltip direction="right">
                <template #content>
                  Set a displayed name for a conversation visible to all other participants (or leave it empty).
                </template>
                <div class="modify-form-first-alias-label">Alias:</div>
              </GeneralTooltip>
            </template>
          </GeneralInputText>
        </div>
      </div>
      <div class="modify-form-buttons">
        <GeneralIconButton
          title="Leave conversation"
          tooltipDirection="right"
          :icon="PowerIcon"
          size="1.5rem"
          type="button"
          @click="leaveConversation"
        />
        <GeneralIconButton
          title="Send message"
          :icon="PaperAirplaneIcon"
          size="2.5rem"
          type="submit"
          tooltipDirection="left"
          :disabled="submit.loading.value || leave.loading.value"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.modify {
  padding: 2rem;
  width: 80vw;

  &-error {
    font-size: var(--text-xxl);
  }

  &-form {
    display: grid;
    row-gap: 4rem;

    &-first {
      display: flex;
      flex-direction: column;
      gap: 4rem;

      &-multiselect {
        &-noone {
          font-size: var(--text-xl);
        }

        &-users {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
      }

      &-alias {
        &-label {
          font-size: var(--text-xl);
          padding-bottom: 0.5rem;
        }
      }
    }

    &-buttons {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
