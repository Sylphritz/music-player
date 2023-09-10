<template>
  <main>
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis,
            congue augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet,
            venenatis et sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">Songs</span>
          <!-- Icon -->
          <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <AppSongItem v-for="song in songs" :key="song.docID" :song="song" />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import { songsCollection } from '@/includes/firebase'
import AppSongItem from '@/components/SongItem.vue'

export default {
  name: 'Home',
  components: {
    AppSongItem
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
