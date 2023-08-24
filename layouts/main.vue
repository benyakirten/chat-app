<template>
  <div class="container">
    <NavTheSidebar />
    <NavTheHamburgerMenu />
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  max-width: 100vw;

  main {
    min-height: 100vh;
  }
}
</style>
