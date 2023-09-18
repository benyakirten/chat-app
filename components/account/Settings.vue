<script setup lang="ts">
const props = defineProps<{ me: Me; profile: User }>()
const userStore = useUsersStore()

const convertOptionToText = (option: number) => `${option * 10}%`
const magnificationOptions = Array.from({ length: 8 }, (_, idx) => ({ id: convertOptionToText(7 + idx) }))
const magnificationSelected = ref(
  new Set([convertOptionToText(isNaN(props.me.textSizeMagnification) ? 10 : props.me.textSizeMagnification * 10)])
)
const search = (item: { id: string }, text: string) => item.id.includes(text)
watch(magnificationSelected, (val) => userStore.setMyOptions('textSizeMagnification', getFirstSetItem(val) ?? '100%'))

const themeOptions = [{ id: 'night' }, { id: 'day' }, { id: 'auto' }]
const themeSelected = ref(new Set([capitalize(props.me.colorTheme)]))
watch(themeSelected, (val) => userStore.setMyOptions('colorTheme', getFirstSetItem(val) ?? 'night'))

const userName = ref(userStore.userMe?.name)
const { debouncer } = useDebounce((val: string) => userStore.setMyOptions('name', val), 1200)
watch(userName, (val) => val && debouncer(val))
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
        :search="search"
      >
        <template #label>
          <div class="user-settings-label">Choose text magnification</div>
        </template>
        <template #item="{ item }">
          <div class="user-settings-item">{{ item.id }}</div>
        </template>
      </BaseMultiSelect>
      <BaseMultiSelect
        :options="themeOptions"
        v-model="themeSelected"
        title="Color Theme"
        placeholder="Set color theme..."
        type="single"
        :search="search"
        :get-text="(item) => capitalize(item.id)"
      >
        <template #label>
          <div class="user-settings-label">Choose color theme</div>
        </template>
        <template #item="{ item }">
          <div class="user-settings-item" style="text-transform: capitalize">
            {{ item.id }}
          </div>
        </template>
      </BaseMultiSelect>
      <GeneralInputText v-if="userName" v-model="userName" placeholder="Choose a username">
        <template #label><div class="user-settings-label">Display Name</div> </template>
      </GeneralInputText>
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

    &-label {
      font-size: var(--text-xl);
      padding-bottom: 1rem;
    }

    &-item {
      color: var(--text);
      font-size: var(--text-xl);

      display: flex;
      padding-inline: 1rem;
      padding-block: 0.4rem;
      align-items: center;
    }
  }

  &-statistics {
    /*  */
  }
}
</style>
