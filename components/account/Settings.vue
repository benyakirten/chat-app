<script setup lang="ts">
const props = defineProps<{ me: Me; profile: User }>()
const userStore = useUsersStore()

const convertOptionToText = (option: number) => `${option * 10}%`
const magnificationOptions = Array.from({ length: 8 }, (_, idx) => ({ id: convertOptionToText(7 + idx) }))
const magnificationSelected = ref(
  new Set([convertOptionToText(isNaN(props.me.textSizeMagnification) ? 10 : props.me.textSizeMagnification * 10)])
)
const searchMagnification = (item: { id: string }, text: string) => item.id.includes(text)
watch(magnificationSelected, (val) => userStore.setMyOptions('textSizeMagnification', getFirstSetItem(val) ?? '100%'))

const themeOptions = [{ id: 'night' }, { id: 'day' }, { id: 'auto' }]
const themeSelected = new Set([props.me.colorTheme])
</script>

<template>
  <div class="user">
    <h2>Change Settings</h2>
    <div class="user-settings">
      <BaseMultiSelect
        :options="magnificationOptions"
        v-model="magnificationSelected"
        title="Text Magnification"
        placeholder="Set text magnification..."
        type="single"
        :search="searchMagnification"
      >
        <template #label>
          <div class="user-settings-magnification-label">Choose text magnification</div>
        </template>
        <template #item="{ item }">
          <div class="user-settings-magnification-item">{{ item.id }}</div>
        </template>
      </BaseMultiSelect>
      <!-- Color theme -->
      <!-- Name -->
    </div>
    <h2>Statistics</h2>
    <div class="user-statistics">
      <!--  -->
    </div>
    <!-- Vital data (# private conversaitons, # public conversations, rank by # messages by me and total) -->
  </div>
</template>

<style scoped>
.user {
  height: 100%;
  padding: 2rem;

  &-settings {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 4rem;

    &-magnification {
      &-label {
        font-size: var(--text-xl);
        padding-bottom: 1rem;
      }

      &-item {
        color: var(--text);
        font-size: var(--text-xl);
      }
    }
  }

  &-statistics {
    /*  */
  }
}
</style>
