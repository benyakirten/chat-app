<script setup lang="ts">
import Chart from 'chart.js/auto'

const props = defineProps<{ me: Me; profile: User }>()

const messageStore = useMessageStore()
const userStore = useUsersStore()

const canvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart<any, any, any> | null = null

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

const otherPeople = computed(() => {
  const uniqueIds = myConversations.value.reduce<Set<string>>((acc, next) => {
    for (const member of next.members.keys()) {
      acc.add(member)
    }
    return acc
  }, new Set())

  const memberNames: string[] = []
  for (const id of uniqueIds) {
    const user = userStore.users.get(id)
    if (!user) {
      continue
    }

    memberNames.push(user.name)
  }

  return memberNames
})

const messages = computed(() => {
  let messages: ConversationMessage[] = []
  for (const conversation of myConversations.value) {
    messages = messages.concat([...conversation.messages.values()])
  }

  return messages
})

const myMessages = computed(() => messages.value.filter((message) => message.sender === props.me.id))
const otherMessages = computed(() => messages.value.filter((message) => message.sender !== props.me.id))

onMounted(() => {
  if (!canvas.value) {
    return
  }

  chart = new Chart(canvas.value, {
    type: 'doughnut',
    data: {
      labels: ['Private', 'Group'],
      datasets: [
        {
          label: 'Number of conversations',
          data: [conversationRatio.value.private, conversationRatio.value.group],
          backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
          hoverOffset: 4,
        },
      ],
    },
  })
})
</script>

<template>
  <div class="charts">
    <AccountChartsGroupTypes v-bind="conversationRatio" />
  </div>
</template>

<style scoped>
.charts {
  width: 50vw;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 4rem;
  row-gap: 6rem;
}
</style>
