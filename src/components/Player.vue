<template>
  <div
    class="fixed bottom-0 left-0 px-4 py-4 w-full bg-gradient-to-b from-gray-900/90 to-pink-800"
    :class="[current_song.modified_name ? 'opacity-100' : 'opacity-50']"
  >
    <!-- Track Info -->
    <div class="text-center text-white" v-if="current_song.modified_name">
      <span class="font-bold">{{ current_song.modified_name }}</span> by
      {{ current_song.display_name }}
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <button type="button" @click.prevent="toggleAudio" id="player-play-btn">
        <i class="fa text-white text-xl" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
      </button>
      <div class="w-[50px] text-right text-white">{{ seek }}</div>
      <div
        class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
        @click.prevent="updateSeek"
      >
        <span
          class="absolute -top-2.5 -ml-2.5 text-white text-lg shadow"
          :style="{ left: playerProgress }"
        >
          <i class="fas fa-circle"></i>
        </span>
        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          :style="{ width: playerProgress }"
        ></span>
      </div>
      <div class="w-[50px] text-white">{{ duration }}</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import usePlayerStore from '@/stores/player'

export default {
  name: 'Player',
  methods: {
    ...mapActions(usePlayerStore, ['toggleAudio', 'updateSeek'])
  },
  computed: {
    ...mapState(usePlayerStore, ['playing', 'seek', 'duration', 'playerProgress', 'current_song'])
  }
}
</script>
