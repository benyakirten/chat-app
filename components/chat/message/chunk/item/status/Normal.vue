<script setup lang="ts">
defineProps<{ isMine: boolean; readList: string[]; isPrivate: boolean; createTime: Date; updateTime: Date }>()
</script>

<template>
  <span>
    <span v-if="isMine && isPrivate && readList.length > 0"> Read </span>
    <span v-if="isMine && readList.length > 0">
      <GeneralTooltip>
        <template #content> By {{ readList.join(', ') }} </template>
        Read
      </GeneralTooltip>
    </span>
    <span v-else> Sent </span>
    {{ formatMessageDate(createTime) }}
    <GeneralTooltip v-if="createTime.valueOf() !== updateTime.valueOf()">
      <template #content> Latest edit at {{ formatMessageDate(updateTime) }} </template>
      (Edited)
    </GeneralTooltip>
  </span>
</template>
