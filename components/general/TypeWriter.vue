<script setup lang="ts">
const props = withDefaults(defineProps<{ message: string; delay?: number; tag: typeof TEXT_TAGS }>(), { delay: 10 })
const displayText = ref('')
const textInterval = ref<NodeJS.Timeout | null>(null)
const clearingPromise = ref<Promise<void> | null>(null)

watch(
  () => props.message,
  async (newValue, oldValue) => {
    if (clearingPromise) {
      clearWorkInProgress()
    }

    const charactersInCommon = calculateCharactersInCommon(newValue, oldValue)
    clearingPromise.value = removeEachLetter(charactersInCommon)
    await clearingPromise.value

    //
  }
)

/**
 * Found out how many characters two strings have in common, starting from the beginning
 */
function calculateCharactersInCommon(newValue: string, oldValue: string): number {
  let sameLetterCount = 0
  for (let i = 0; i < oldValue.length; i++) {
    const newChar = newValue.charAt(i),
      oldChar = oldValue.charAt(i)
    if (newChar && newChar === oldChar) {
      sameLetterCount++
    } else {
      break
    }
  }
  return sameLetterCount
}

function removeEachLetter(only?: number): Promise<void> {
  return new Promise((resolve) => {
    let count: number = 0
    function end(interval: NodeJS.Timeout) {
      clearInterval(interval)
      return resolve()
    }
    textInterval.value = setInterval(() => {
      if (only) {
        if (only === count) {
          return end(textInterval.value!)
        }
        only++
      }

      if (displayText.value === '') {
        return end(textInterval.value!)
      }

      displayText.value = displayText.value.slice(0, -1)
    }, props.delay)
  })
}

function clearWorkInProgress() {
  clearInterval(textInterval.value!)
  textInterval.value = null
  clearingPromise.value = null
}
</script>

<template>
  <component :is="props.tag">
    {{ displayText }}
  </component>
</template>
