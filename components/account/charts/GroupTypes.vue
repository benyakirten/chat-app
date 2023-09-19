<script lang="ts" setup>
import Chart from 'chart.js/auto'

const props = defineProps<{ private: number; group: number }>()
const canvas = ref<HTMLCanvasElement | null>(null)
const themeStore = useThemeStore()
let chart: Chart<'doughnut', number[], string>

watch([() => props.private, () => props.group], ([privateChats, groupChats]) => {
  if (!chart) {
    return
  }
  chart.data.datasets[0].data[0] = privateChats
  chart.data.datasets[0].data[1] = groupChats
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
      labels: ['Private', 'Group'],
      datasets: [
        {
          label: 'Number of conversations',
          data: [props.private, props.group],
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
