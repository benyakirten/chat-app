<script setup lang="ts">
import { useLayoutStore } from "@/stores/layout";
const layoutStore = useLayoutStore()
</script>

<template>
  <Transition name="fade-in">
    <div v-if="layoutStore.sidebarOpen" class="backdrop"></div>
  </Transition>
  <Transition name="slide-in">
    <nav v-if="layoutStore.sidebarOpen" @mouseenter="layoutStore.setTabOpened('chat')"
      @mouseleave="layoutStore.setTabOpened(null)">
      <div class="section">
        <div class="section-contents">
          <div class="setion-header">
            <NuxtLink to="/">CHAT</NuxtLink>
          </div>
          <Transition name="section-expanded">
            <div class="section-expanded" v-if="layoutStore.sidebarTabOpened === 'chat'">
              <p>Lorem Ipsum</p>
              <p>Lorem ipsum dolor</p>
              <p>Lorem ipsum dolor</p>
            </div>
          </Transition>
        </div>
      </div>
      <div class="section" @mouseenter="layoutStore.setTabOpened('other')" @mouseleave="layoutStore.setTabOpened(null)">
        <div class="section-contents">
          <div class="section-header">
            <NuxtLink to="/about">ABOUT</NuxtLink>
          </div>
          <Transition name="section-expanded">
            <div class="section-expanded" v-if="layoutStore.sidebarTabOpened === 'other'">
              <p>Lorem Ipsum</p>
              <p>Lorem ipsum dolor</p>
              <p>Lorem ipsum dolor</p>
            </div>
          </Transition>
        </div>
      </div>
      <div class="section" @mouseenter="layoutStore.setTabOpened('account')" @mouseleave="layoutStore.setTabOpened(null)">
        <div class="section-contents">
          <div class="section-header">
            <NuxtLink to="/account">ACCOUNT</NuxtLink>
          </div>
          <Transition name="section-expanded">
            <div class="section-expanded" v-if="layoutStore.sidebarTabOpened === 'account'">
              <p>Lorem Ipsum</p>
              <p>Lorem ipsum dolor</p>
              <p>Lorem ipsum dolor</p>
            </div>
          </Transition>
        </div>
      </div>
    </nav>
  </Transition>
</template>

<style scoped>
.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom right, #00000040 25%, #00000020 80%, #00000010);
  opacity: 1;
}

.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity var(--time-250) ease-in-out var(--time-100);
  transform-origin: left;
}

.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
}


nav {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.section {
  width: var(--section-width, 10rem);
  padding: 1rem;
  box-shadow: -7px 8px 6px -3px rgba(0, 0, 0, 0.25);
  transition: transform var(--time-250) ease-in;

  &-contents {
    transition: transform var(--time-250) ease-in;
  }

  &:hover {
    transform: scaleX(1.05);
  }

  &:hover>&-contents {
    transform: scaleX(calc(1 / 1.05));
  }

  &:nth-of-type(1) {
    --section-width: 12rem;
    background-color: green;
    z-index: 5;
  }

  &:nth-of-type(2) {
    --section-width: 11rem;
    background-color: lightgreen;
    z-index: 4;
  }

  &:nth-of-type(3) {
    --section-width: 10rem;
    background-color: lightblue;
    z-index: 3;
  }
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: translate var(--time-250) ease-in-out;
}

.slide-in-enter-from,
.slide-in-leave-to {
  translate: -100% 0;
}

.section-expanded-enter-active,
.section-expanded-leave-active {
  transition: all var(--time-250) ease-in-out;
  height: 4rem;
  opacity: 1;
}

.section-expanded-enter-from,
.section-expanded-leave-to {
  height: 0px;
  opacity: 0;
}
</style>
