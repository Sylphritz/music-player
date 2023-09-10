<template>
  <AppHeader />

  <!-- Wrap the component in the <transition> component to animate it -->
  <RouterView v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>

  <AppPlayer />

  <AppAuth />
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppAuth from '@/components/AppAuth.vue'
import AppPlayer from '@/components/Player.vue'
import { mapWritableState } from 'pinia'
import useUserStore from '@/stores/user'
import { auth } from '@/includes/firebase'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
    AppPlayer
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn'])
  },
  created() {
    console.log(auth.currentUser)
    if (auth.currentUser) {
      this.userLoggedIn = true
    }
  }
}
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active,
.fade-leave.active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  opacity: 0;
}
</style>
