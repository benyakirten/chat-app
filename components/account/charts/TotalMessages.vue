<script setup lang="ts">
import Chart from 'chart.js/auto'

// TODO: Generalize these functions

const props = defineProps<{ myMessages: ConversationMessage[]; otherMessages: ConversationMessage[] }>()
const themeStore = useThemeStore()

const canvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart<'doughnut', number[], string>

watch([() => props.myMessages, () => props.otherMessages], ([myMessages, otherMessages]) => {
  if (!chart) {
    return
  }

  chart.data.datasets[0].data[0] = myMessages.length
  chart.data.datasets[0].data[1] = otherMessages.length
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
      responsive: true,
      maintainAspectRatio: false,
    },
    data: {
      labels: ["Number of messages I've sent", "Number of messages I've received"],
      datasets: [
        {
          label: 'Number of messages',
          data: [props.myMessages.length, props.otherMessages.length],
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
