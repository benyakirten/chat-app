<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/24/solid';

import { formatMessageDate } from '@/lib/dates';
import { ConversationMessage } from '@/stores/messages';

const emits = defineEmits<{
  (e: 'resend', event: MouseEvent): void
}>()
const { isMine, isPrivate, createTime, updateTime, status, align, readList } = defineProps<{
  isMine: boolean,
  readList: string[],
  isPrivate: boolean,
  createTime: Date,
  updateTime: Date,
  status: ConversationMessage['status'],
  align: 'right' | 'left'
}>()
</script>

<template>
  <!-- TODO: Make this less 🍝 -->
  <div class="status">
    <span
      class="status-error"
      v-if="isMine && status === 'error'"
    >
      <span>An error occurred</span>
      <GeneralIconButton
        :icon="ArrowPathIcon"
        size="0.8rem"
        title="Retry Sending Message"
        @click="emits('resend', $event)"
      />
    </span>
    <span
      v-else-if="isMine && status === 'pending'"
      class="status-loading"
    >
      Loading
      <GeneralLoading size="0.8rem" />
    </span>
    <span v-else>
      <span v-if="isMine && isPrivate && readList.length > 0">
        Read
      </span>
      <span v-if="isMine && readList.length > 0">
        <GeneralTooltip>
          <template #content>
            By {{ readList.join(", ") }}
          </template>
          Read
        </GeneralTooltip>
      </span>
      <span v-else>
        Sent
      </span>
      {{ formatMessageDate(createTime) }}
      <GeneralTooltip v-if="createTime.valueOf() !== updateTime.valueOf()">
        <template #content>
          Edited at {{ formatMessageDate(updateTime) }}
        </template>
        (Edited)
      </GeneralTooltip>
    </span>
  </div>
</template>

<style scoped>
.status {
  color: var(--neutral);
  width: 100%;
  text-align: v-bind(align);
  font-size: 0.6rem;

  &-error {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    justify-content: flex-end;
  }

  &-loading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: flex-end;
  }
}</style>
