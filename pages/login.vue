<script lang="ts" setup>
import { formatAuthErrors } from '@/utils/auth'

const toastStore = useToastStore()
const userStore = useUsersStore()
const authStore = useAuthStore()

const loginMode = ref(true)
const email = ref('')
const password = ref('')
const displayName = ref('')
const rememberMe = ref(true)

function alternateMode() {
  loginMode.value = !loginMode.value
}

async function handleSubmit(e: Event) {
  const res = await useFetch(`/auth/${loginMode.value ? 'login' : 'register'}`, {
    method: 'POST',
    body: {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value,
      displayName: loginMode.value === false && displayName.value ? displayName.value : undefined,
    },
  })

  if (res.error.value) {
    toastStore.add(formatAuthErrors(res.error.value.data.error), { type: 'error', timeout: null })
    return
  }

  userStore.processAuthData(res.data.value)
  await navigateTo('/chat')
}

onMounted(async () => {
  if (authStore.state) {
    await authStore.state
  }

  if (userStore.me) {
    await navigateTo('/chat')
  }
})
</script>

<template>
  <div class="login-page">
    <h1>{{ loginMode ? 'login' : 'register' }}</h1>
    <div class="alternate-mode" @click="alternateMode">Need to {{ loginMode ? 'register' : 'login' }} instead?</div>
    <form @submit.prevent="handleSubmit">
      <label>
        Email
        <input v-model="email" type="email" />
      </label>
      <label>
        Password
        <input v-model="password" type="password" />
      </label>
      <GeneralInputCheckbox v-model="rememberMe"> Remember Me </GeneralInputCheckbox>
      <Transition name="display-mode">
        <label v-if="!loginMode">
          Display Name
          <input v-model="displayName" type="string" />
        </label>
      </Transition>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped>
.login-page {
  --header-height: 0;

  display: flex;
  flex-direction: column;
  padding: 8rem 4rem;

  .alternate-mode {
    text-decoration: underline;
  }

  h1 {
    text-transform: capitalize;
  }

  form {
    label {
      display: block;
    }
  }
}

.dispaly-mode-enter-active,
.dispaly-mode-leave-active {
  transition: translate 100ms ease-in-out 100ms, opacity 200ms ease-in;
}

.dispaly-mode-enter-from,
.dispaly-mode-leave-to {
  translate: 0 -100%;
  opacity: 0;
}
</style>
