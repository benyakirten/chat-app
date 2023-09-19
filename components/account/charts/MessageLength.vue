<script setup lang="ts">
import Chart from 'chart.js/auto'

const props = defineProps<{ myMessages: ConversationMessage[]; otherMessages: ConversationMessage[] }>()
const themeStore = useThemeStore()

const canvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart<'doughnut', number[], string>

const averageMessageLength = (messages: ConversationMessage[]) =>
  Math.floor(messages.reduce<number>((acc, next) => acc + next.content.length, 0) / messages.length)

const myMessageLength = computed(() => averageMessageLength(props.myMessages))
const otherMessageLength = computed(() => averageMessageLength(props.otherMessages))

watch([myMessageLength, otherMessageLength], ([myLength, otherLength]) => {
  if (!chart) {
    return
  }

  chart.data.datasets[0].data[0] = myLength
  chart.data.datasets[0].data[1] = otherLength
  chart.update()
})

watch(
  () => themeStore.activeTheme,
  (theme) => {
    if (!chart) {
      return
    }
    chart.options.color = theme.text
    chart.update()
  }
)

onMounted(() => {
  if (!canvas.value) {
    return
  }

  chart = new Chart(canvas.value, {
    type: 'doughnut',
    options: {
      color: themeStore.activeTheme.text,
    },
    data: {
      labels: ['My average message length', "Others' average message length"],
      datasets: [
        {
          label: 'Number of conversations',
          data: [myMessageLength.value, otherMessageLength.value],
          backgroundColor: ['#3abff8', '#f87272'],
        },
      ],
    },
  })
})

onUnmounted(() => {
  chart.destroy()
})
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
