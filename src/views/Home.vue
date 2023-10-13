<template>
  <main>
    <section class="mb-8 py-20 text-white relative">
      <div
        class="absolute inset-0 w-full h-full bg-cover bg-center -z-10 opacity-20"
        style="background-image: url(assets/img/wavy-lines.png)"
      ></div>
      <div class="relative container mx-auto">
        <div class="text-white">
          <h1 class="w-3/5 mb-5 -ml-px font-thin leading-tight tracking-tight uppercase text-5xl">
            {{ $t('home.listen') }}
          </h1>
          <p class="w-3/5 text-lg">
            A community-driven music player. Upload you songs and let everyone listen to them!
          </p>
        </div>
        <img
          class="absolute right-9 top-1/2 -translate-y-1/2 h-72 drop-shadow-lg"
          src="/assets/img/hero-image.png"
        />
      </div>
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-gray-800/50 rounded relative flex flex-col">
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-700/80"
          v-icon="{ icon: 'headphones-alt', right: true }"
        >
          <span class="card-title text-white uppercase tracking-wider">Songs</span>
        </div>
        <ol id="playlist">
          <AppSongItem v-for="song in songs" :key="song.docID" :song="song" />
        </ol>
      </div>
    </section>
  </main>
</template>

<script>
import { songsCollection } from '@/includes/firebase'
import AppSongItem from '@/components/SongItem.vue'
import Icon from '@/directives/icon'

export default {
  name: 'Home',
  components: {
    AppSongItem
  },
  directives: {
    icon: Icon
  },
  data() {
    return {
      songs: [],
      maxPerPage: 25,
      pendingRequest: false,
      noMore: false
    }
  },
  async created() {
    this.getSongs()

    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      // scrollTop = the amount of pixels away from the very top of an element (in this case, the HTML document itself)
      // offsetHeight = the actual height of an element on the page
      // window.innerHeight = the viewport height (what user can see)
      const { scrollTop, offsetHeight } = document.documentElement
      const { innerHeight } = window
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

      if (bottomOfWindow) {
        this.getSongs()
      }
    },
    async getSongs() {
      if (this.pendingRequest || this.noMore) {
        return
      }

      this.pendingRequest = true

      let snapshot

      if (this.songs.length) {
        // Get the last song on the list
        const lastDoc = await songsCollection.doc(this.songs[this.songs.length - 1].docID).get()

        // startAfter() requires the collection to be sorted first in order for it to work
        snapshot = await songsCollection
          .orderBy('modified_name')
          .startAfter(lastDoc)
          .limit(this.maxPerPage)
          .get()
      } else {
        snapshot = await songsCollection.orderBy('modified_name').limit(this.maxPerPage).get()
      }

      if (!snapshot.size) {
        this.noMore = true
        this.pendingRequest = false
        return
      }

      snapshot.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data()
        })
      })

      this.pendingRequest = false
    }
  }
}
</script>
