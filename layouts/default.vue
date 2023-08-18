<template>
  <div class="container">
    <NavTheNav />
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
  }
}
</style>
