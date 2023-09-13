<template>
  <header class="header">
    <div class="header-search">
      <NavSearchBar />
    </div>
    <div class="header-hamburger">
      <NavHamburgerMenu />
    </div>
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  height: 6rem;

  align-items: center;
  display: grid;
  grid-template-columns: 30% 50% 1fr;
  background-color: var(--bg-alt5);

  &-search {
    grid-column: 2 / 3;
  }

  &-hamburger {
    justify-self: end;
    padding-right: 4rem;
    grid-column: 3 / -1;
  }
}
</style>
