<script setup lang="ts">
import { TextTag } from '~/utils/types'

const props = withDefaults(
  defineProps<{ message: string; clearSpeed?: number; addSpeed?: number; tag: TextTag; shareCharacters?: boolean }>(),
  { clearSpeed: 100, addSpeed: 400, shareCharacters: true }
)
const displayText = ref('')

const textClearInterval = ref<NodeJS.Timeout | null>()
const clearingPromise = ref<Promise<void> | null>(null)

const textWriteInterval = ref<NodeJS.Timeout | null>()
const writingPromise = ref<Promise<void> | null>(null)

watch(
  () => props.message,
  async (newValue, oldValue) => {
    oldValue ??= ''
    displayText.value ??= ''
    clearWorkInProgress()

    const charactersInCommon = props.shareCharacters ? calculateCharactersInCommon(newValue, oldValue) : 0
    clearingPromise.value = removeLetters(oldValue.length - charactersInCommon)
    await clearingPromise.value

    writingPromise.value = buildTo(newValue, charactersInCommon)
    await writingPromise.value
  },
  { immediate: true }
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
    }, props.clearSpeed)
  })
}

function buildTo(newValue: string, charactersInCommon: number): Promise<void> {
  return new Promise((resolve) => {
    let currIndex = charactersInCommon
    let _displayText: string = ''
    textWriteInterval.value = setInterval(() => {
      if (currIndex === newValue.length) {
        return end(textWriteInterval.value!, resolve)
      }

      _displayText += newValue.charAt(currIndex)
      displayText.value = _displayText
      currIndex++
    }, props.addSpeed)
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
  <component :is="props.tag"> <!-- {{ displayText }} -->HELLO </component>
</template>
