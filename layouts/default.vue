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

  main {
    width: 100%;
    min-height: 100vh;
  }
}
</style>
