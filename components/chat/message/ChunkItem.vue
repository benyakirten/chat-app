<script setup lang="ts">
import { formatMessageDate } from '@/lib/dates';
import type { ConversationMessage, UserReadTimes } from '@/stores/messages';
import { useUsersStore } from '@/stores/users';

const userStore = useUsersStore()
const { message, isMine, readTimes, isFirst, isLast } = defineProps<{ message: ConversationMessage, readTimes: UserReadTimes, isMine: boolean, isFirst: boolean, isLast: boolean }>()

const readList = computed(() => {
  const readUsers: string[] = []

  // TODO: Flatten this
  for (const userId in readTimes) {
    const readTime = readTimes[userId]
    if (readTime.valueOf() > message.createTime.valueOf()) {
      const user = userStore.users.get(userId)
      if (user) {
        readUsers.push(user.name)
      }
    }
  }

  return readUsers
})
const textAlign = computed(() => isMine ? 'right' : 'left')
</script>

<template>
  <div class="message">
    <!--
      How should message buttons be displayed
      Implanted into message box on side/top?
      On floating bar above a message like Discord?
    -->
    <!-- <div class="message-buttons" v-if="isMine"></div> -->
    <div v-if="isFirst" class="message-author">{{ userStore.users.get(message.sender)?.name ?? "Unknown User" }}</div>
    <div class="message-content">
      <!-- TODO: Add parsing for code blocks/etc -->
      {{ message.content }}
    </div>
    <div class="message-status">
      <!--
        If isMine: {{ processing/errored/success/read }} -
          if success, include createTime, if read, include earliest read time, hover tooltip lists all users that have read it
        For both: if edited, say edited (time)
        For example - isMine, errored
      -->
      <span v-if="isMine && message.status === 'error'">An error happened</span>
      <span v-else-if="isMine && message.status === 'pending'">Loading</span>
      <span v-else>
        Sent {{ formatMessageDate(message.createTime) }}
        <GeneralTooltip v-if="message.createTime.valueOf() !== message.updateTime.valueOf()">
          <template #content>
            <div class="tooltip-content">Edited at {{ formatMessageDate(message.updateTime) }}</div>
          </template>
          (Edited)
        </GeneralTooltip>
      </span>
    </div>
    <div v-if="isLast" class="message-tail" :class="isMine ? 'message-tail-right' : 'message-tail-left'"></div>
  </div>
</template>

<style scoped>
.message {
  position: relative;
  display: grid;
  row-gap: 0.5rem;
  place-items: center;

  /* border-radius: 2rem; */
  background-color: var(--bg-color-alt1);

  padding: 0.75rem;


  &-author {
    color: var(--highlight);
  }

  &-buttons {
    /*  */
  }

  &-content {
    text-align: left;
    width: 100%;
  }

  &-status {
    color: var(--neutral);
    width: 100%;
    text-align: v-bind(textAlign);
    font-size: 0.6rem;

    .tooltip-content {
      font-size: 1.4rem;
      padding: 1rem 0.5rem;
    }
  }

  &-tail {
    place-self: end;
    width: 1rem;
    height: 1rem;
    background-color: var(--bg-color-alt1);
    position: absolute;

    --dist: 0.75rem;

    &-left {
      left: calc(-1 * var(--dist));
      bottom: var(--dist);
      clip-path: polygon(0 100%, 100% 100%, 100% 0);
    }

    &-right {
      right: calc(-1 * var(--dist));
      bottom: var(--dist);
      clip-path: polygon(0 0, 0 100%, 100% 100%);
    }
  }

}
</style>
