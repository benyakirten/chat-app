<script lang="ts" setup>
import Chart from 'chart.js/auto'

const props = defineProps<{ private: number; group: number }>()
const canvas = ref<HTMLCanvasElement | null>(null)
const themeStore = useThemeStore()
let chart: Chart<'doughnut', number[], string>

watch([props.private, props.group], ([privateChats, groupChats]) => {
  if (!chart) {
    return
  }
  chart.data.datasets[0].data[0] = privateChats
  chart.data.datasets[0].data[1] = groupChats
  chart.update()
})

onMounted(() => {
  if (!canvas.value) {
    return
  }

  chart = new Chart(canvas.value, {
    type: 'doughnut',
    options: {
      color: themeStore.activeTheme.text,
      font: {
        family: 'Roboto',
      },
    },
    data: {
      labels: ['Private', 'Group'],
      datasets: [
        {
          label: 'Number of conversations',
          data: [props.private, props.group],
          backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
          hoverOffset: 4,
        },
      ],
    },
  })
})
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
