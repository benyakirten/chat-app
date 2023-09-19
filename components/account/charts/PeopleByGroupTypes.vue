<script lang="ts" setup>
import Chart from 'chart.js/auto'

const props = defineProps<{ private: Set<string>; group: Set<string> }>()
const canvas = ref<HTMLCanvasElement | null>(null)
const themeStore = useThemeStore()
let chart: Chart<'bar', number[], string>

const unions = computed(() => {
  let numUsersIntersection = 0
  props.private.forEach((user) => props.group.has(user) && numUsersIntersection++)

  const numUsersDisjoint = props.private.size + props.group.size - numUsersIntersection

  return { intersection: numUsersIntersection, disjoint: numUsersDisjoint }
})

watch([() => props.private, () => props.group, unions], ([privateSet, group, { intersection, disjoint }]) => {
  if (!chart) {
    return
  }
  chart.data.datasets[0].data[0] = privateSet.size
  chart.data.datasets[0].data[1] = group.size
  chart.data.datasets[0].data[2] = intersection
  chart.data.datasets[0].data[3] = disjoint

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
    type: 'bar',
    options: {
      color: themeStore.activeTheme.text,
      responsive: true,
      maintainAspectRatio: false,
    },
    data: {
      labels: ['Private', 'Group', 'In both', 'In one'],
      datasets: [
        {
          label: 'What types of conversations are people in',
          data: [props.private.size, props.group.size, unions.value.intersection, unions.value.disjoint],
          backgroundColor: ['#3abff8', '#36d399', '#fbbd23', '#f87272'],
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
