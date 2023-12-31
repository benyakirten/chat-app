<template>
  <section class="section">
    <h1>About</h1>
    <p>
      This is a personal project to try creating real-time chat with encryption. I am not a security expert, and you
      should not trust this site with any sensitive data.
    </p>
    <p>
      No personal data is stored, and no cookies are used to track you. There is only two cookie used on this website:
      1. An HTTP-only auth cookie used for authentication and 2. A cookie to remember your theme preference, stored with
      a same site policy.
    </p>
    <p>
      If you want to read more about me, read
      <BaseLink class="link" to="https://benyakir-writes.com">my blog</BaseLink> or view the
      <BaseLink class="link" to="https://github.com/benyakirten/chat-app">the project source code</BaseLink>.
    </p>
  </section>
</template>

<style scoped>
.section {
  padding: 2rem;
  width: 70vw;

  display: flex;
  flex-direction: column;
  gap: var(--size-md);

  h1 {
    text-transform: capitalize;
  }

  p {
    font-size: var(--text-size-lg);

    .link {
      color: var(--accent);
    }
  }
}
</style>
