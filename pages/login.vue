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
        <GeneralInputText v-model="email" type="email" placeholder="you@example.com" required>
          <template #error>Email must be a valid email</template>
          <template #label> Email </template>
        </GeneralInputText>
        <GeneralInputText
          v-model="password"
          type="password"
          placeholder="At least 12 letters, 1 upper, lower, number and special character..."
          required
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*+`~'])[A-Za-z\d!@#$%^&*+`~']{12,}$"
        >
          <template #label> Password </template>
          <template #error>
            Password must have the following characteristics: 1. be at least 12 letters long 2. have at least 1
            uppercase letter 3. have at least 1 lowercase letter 4. have at least 1 number 5. have at least one of the
            following characters: !@#$%^&*+`~'
          </template>
        </GeneralInputText>
        <Transition name="display-mode">
          <GeneralInputText v-if="!loginMode" v-model="displayName" placeholder="Cool Name">
            <template #label> Display Name </template>
          </GeneralInputText>
        </Transition>
        <GeneralInputCheckbox v-model="rememberMe"> Remember Me </GeneralInputCheckbox>
        <BaseRoundedButton type="submit">Submit</BaseRoundedButton>
      </form>
    </div>
  </section>
</template>

<style scoped>
.login-page {
  display: grid;
  place-items: center;

  padding-block-start: 10%;

  .content {
    width: 40%;

    @media (width <= 700px) {
      width: 60%;
    }

    @media (width <= 600px) {
      width: 70%;
    }

    @media (width <= 400px) {
      width: 80%;
    }
  }

  .mode {
    padding-block: var(--size-md);

    &-title {
      text-transform: capitalize;
      font-size: calc(2 * var(--text-size-xxl));
      padding-block-end: calc(0.5 * var(--size-md));

      @media (width <= 400px) {
        font-size: calc(var(--text-size-xxl));
        padding-block-end: calc(0.5 * var(--size-sm));
      }
    }

    &-alternate {
      text-decoration: underline;
      font-size: var(--text-size-xxl);

      @media (width <= 400px) {
        font-size: calc(var(--text-size-lg));
      }
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--size-md);
  }
}
</style>
