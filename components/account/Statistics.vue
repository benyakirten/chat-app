<script setup lang="ts">
import Chart from 'chart.js/auto'

const props = defineProps<{ me: Me; profile: User }>()

const messageStore = useMessageStore()
const userStore = useUsersStore()

Chart.defaults.font.family = 'Roboto'

const myConversations = computed(() => messageStore.conversations.filter((convo) => convo.members.has(props.me.id)))

const conversationRatio = computed(() =>
  myConversations.value.reduce<{ private: number; group: number }>(
    (acc, next) => {
      const key = next.isPrivate ? 'private' : 'group'
      acc[key]++
      return acc
    },
    { private: 0, group: 0 }
  )
)

const peopleByGroups = computed(() => {
  return myConversations.value.reduce<{ private: Set<string>; group: Set<string> }>(
    (acc, next) => {
      const key = next.isPrivate ? 'private' : 'group'
      for (const member of next.members.keys()) {
        if (member !== userStore.me?.id) {
          acc[key].add(member)
        }
      }
      return acc
    },
    { private: new Set(), group: new Set() }
  )
})

const messages = computed(() => {
  let messages: (ConversationMessage & { isPrivate: boolean })[] = []
  for (const conversation of myConversations.value) {
    messages = messages.concat(
      [...conversation.messages.values()].map((val) => ({ ...val, isPrivate: conversation.isPrivate }))
    )
  }

  return messages
})

const myMessages = computed(() => messages.value.filter((message) => message.sender === props.me.id))
const otherMessages = computed(() => messages.value.filter((message) => message.sender !== props.me.id))
</script>

<template>
  <div class="row">
    <div class="row-block">
      <AccountChartsGroupTypes v-bind="conversationRatio" />
    </div>
    <div class="row-block">
      <AccountChartsPeopleByGroupTypes v-bind="peopleByGroups" />
    </div>
  </div>

  <div class="row">
    <div class="row-block">
      <AccountChartsMessageLength :my-messages="myMessages" :other-messages="otherMessages" />
    </div>

    <div class="row-block">
      <AccountChartsTotalMessages :my-messages="myMessages" :other-messages="otherMessages" />
    </div>
  </div>
</template>

<style scoped>
/* For some reason, the charts do not do well with flex boxes or grid */
.row {
  display: flex;
  gap: 4rem;
  flex-wrap: wrap;

  @media (width < 800px) {
    flex-direction: column;
  }

  &-block {
    flex: 1;
    max-width: 40rem;
    max-height: 40rem;
  }
}
</style>
