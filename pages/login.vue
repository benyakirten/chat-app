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
const formRef = ref<HTMLFormElement | null>(null)
const formValid = ref(false)

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

function checkFormValidity() {
  formValid.value = !!formRef.value?.checkValidity()
}
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
      <form ref="formRef" @submit.prevent="handleSubmit" @input="checkFormValidity">
        <GeneralInputText v-model="email" type="email" placeholder="you@example.com" required id="email">
          <template #error>Email must be a valid email</template>
          <template #label> Email </template>
        </GeneralInputText>
        <GeneralInputText
          v-model="password"
          type="password"
          placeholder="At least 12 letters, 1 upper, lower, number and special character..."
          required
          id="password"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*+`~'])[A-Za-z\d!@#$%^&*+`~']{12,}$"
        >
          <template #label> Password </template>
          <template #error>
            <p>Password must have the following characteristics:</p>
            <ol>
              <li>be at least 12 letters long</li>
              <li>have at least 1 uppercase letter</li>
              <li>have at least 1 lowercase letter</li>
              <li>have at least 1 number</li>
              <li>have at least one of the following characters: !@#$%^&*+`~'</li>
            </ol>
          </template>
        </GeneralInputText>
        <Transition name="display-mode">
          <GeneralInputText v-if="!loginMode" v-model="displayName" placeholder="Cool Name">
            <template #label> Display Name </template>
          </GeneralInputText>
        </Transition>
        <GeneralInputCheckbox v-model="rememberMe"> Remember Me </GeneralInputCheckbox>
        <BaseRoundedButton :disabled="!formValid" type="submit">Submit</BaseRoundedButton>
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

  ol {
    list-style: decimal;
    li {
      &::first-letter {
        text-transform: capitalize;
      }
      margin-inline-start: var(--size-lg);
    }
  }
}
</style>
