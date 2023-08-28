<script setup lang="ts">
import { ConversationMessage } from 'stores/messages';

const { isMine, createTime, updateTime, status } = defineProps<{ isMine: boolean, createTime: Date, updateTime: Date, status: ConversationMessage['status'] }>()
</script>
