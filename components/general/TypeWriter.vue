<script setup lang="ts">
import { TextTag } from '~/utils/types'

const props = withDefaults(defineProps<{ message: string; delay?: number; tag: TextTag }>(), { delay: 10 })
const displayText = ref('')

const textClearInterval = ref<NodeJS.Timeout | null>()
const clearingPromise = ref<Promise<void> | null>(null)

const textWriteInterval = ref<NodeJS.Timeout | null>()
const writingPromise = ref<Promise<void> | null>(null)

watch(
  () => props.message,
  async (newValue, oldValue) => {
    clearWorkInProgress()

    const charactersInCommon = calculateCharactersInCommon(newValue, oldValue)
    clearingPromise.value = removeLetters(oldValue.length - charactersInCommon)
    await clearingPromise.value

    writingPromise.value = buildTo(newValue, charactersInCommon)
    await writingPromise.value
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

function removeLetters(only?: number): Promise<void> {
  return new Promise((resolve) => {
    let count: number = 0

    textClearInterval.value = setInterval(() => {
      if (only) {
        if (only === count) {
          return end(textClearInterval.value!, resolve)
        }
        only++
      }

      if (displayText.value === '') {
        return end(textClearInterval.value!, resolve)
      }

      displayText.value = displayText.value.slice(0, -1)
    }, props.delay)
  })
}

function buildTo(newValue: string, charactersInCommon: number): Promise<void> {
  return new Promise((resolve) => {
    let curIndex = charactersInCommon
    textWriteInterval.value = setTimeout(() => {
      if (curIndex === newValue.length) {
        end(textWriteInterval.value!, resolve)
      }
      curIndex++
      displayText.value += newValue.charAt(curIndex)
    }, props.delay)
  })
}

function end(interval: NodeJS.Timeout, resolve: () => void) {
  clearInterval(interval)
  resolve()
}

function clearWorkInProgress() {
  clearInterval(textClearInterval.value!)
  textClearInterval.value = null
  clearingPromise.value = null

  clearInterval(textWriteInterval.value!)
  textWriteInterval.value = null
  writingPromise.value = null
}
</script>

<template>
  <component :is="props.tag">
    {{ displayText }}
  </component>
</template>
