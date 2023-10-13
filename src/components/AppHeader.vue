<template>
  <header class="bg-gradient-to-b from-black/30 to-transparent">
    <nav class="container mx-auto flex justify-between items-center py-3">
      <RouterLink
        class="inline-block bg-gradient-to-r from-pink-400 to-white bg-clip-text text-transparent font-bold uppercase text-2xl tracking-tight mr-3"
        :to="{ name: 'home' }"
        exact-active-class=""
        >Myujikku</RouterLink
      >

      <ul class="flex-none flex flex-row gap-4">
        <li class="border-r border-r-white/30">
          <RouterLink class="px-4 text-white" :to="{ name: 'about' }">About</RouterLink>
        </li>
        <li v-if="!userStore.userLoggedIn">
          <a class="text-white" href="#" @click.prevent="toggleAuthModal">Login</a>
        </li>
        <template v-else>
          <li>
            <RouterLink class="text-white" :to="{ name: 'manage' }">Manage</RouterLink>
          </li>
          <li>
            <a class="text-white" href="#" @click.prevent="signOut">Logout</a>
          </li>
        </template>
      </ul>
    </nav>
  </header>
</template>

<script>
// You can also do
import { mapStores } from 'pinia'
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'

export default {
  name: 'AppHeader',
  computed: {
    ...mapStores(useModalStore, useUserStore)
  },
  methods: {
    toggleAuthModal() {
      // The "modalStore" name is generated from store's id that we defined in the store and the word "Store"
      this.modalStore.isOpen = !this.modalStore.isOpen
    },
    signOut() {
      this.userStore.signOut()

      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
