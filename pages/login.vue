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
  <section class="login-page">
    <div class="content">
      <div class="mode">
        <GeneralTypeWriter class="mode-title" :message="loginMode ? 'login' : 'register'" tag="h1" />
        <button class="mode-alternate" @click="alternateMode">
          Need to {{ loginMode ? 'register' : 'login' }} instead?
        </button>
      </div>
      <form @submit.prevent="handleSubmit">
        <GeneralInputText v-model="email" type="email" placeholder="you@example.com">
          <template #label> Email </template>
        </GeneralInputText>
        <GeneralInputText
          v-model="email"
          type="password"
          placeholder=">= 12 letters, 1 upper, lower, number and symbol..."
        >
          <template #label> Password </template>
        </GeneralInputText>
        <GeneralInputCheckbox v-model="rememberMe"> Remember Me </GeneralInputCheckbox>
        <Transition name="display-mode">
          <GeneralInputText v-if="!loginMode" v-model="displayName" placeholder="Cool Name">
            <template #label> Display Name </template>
          </GeneralInputText>
        </Transition>
        <button type="submit">Submit</button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.login-page {
  display: grid;
  place-items: center;

  padding-block: 4rem;

  .content {
    width: 40%;
  }

  .mode {
    padding-block: var(--size-md);

    &-title {
      text-transform: capitalize;
      font-size: calc(2 * var(--text-size-xxl));
      padding-block-end: calc(0.5 * var(--size-md));
    }

    &-alternate {
      font-size: var(--text-size-xxl);
      text-decoration: underline;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--size-md);
  }
}

.display-mode-enter-active,
.display-mode-leave-active {
  transition: translate 100ms ease-in-out 100ms, opacity 200ms ease-in;
}

.display-mode-enter-from,
.display-mode-leave-to {
  translate: 0 -100%;
  opacity: 0;
}
</style>
