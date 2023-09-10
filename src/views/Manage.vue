<template>
  <main>
    <section class="container mx-auto mt-6">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <AppUpload ref="upload" :add-song="addSong" />
        </div>
        <div class="col-span-2">
          <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
              <span class="card-title">My Songs</span>
              <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
            </div>
            <div class="p-6">
              <CompositionItem
                v-for="(song, index) in songs"
                :key="song.docID"
                :song="song"
                :update-song="updateSong"
                :index="index"
                :remove-song="removeSong"
                :update-unsaved-flag="updateUnsavedFlag"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
// import useUserStore from '@/stores/user'
import AppUpload from '@/components/Upload.vue'
import CompositionItem from '@/components/CompositionItem.vue'
import { songsCollection, auth } from '@/includes/firebase'

export default {
  name: 'manage',
  components: {
    AppUpload,
    CompositionItem
  },
  async created() {
    // Generate a query for fetching data
    // .get() executes the query and returns a snapshot of the data
    const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()

    // Process the document snapshots (the data) and add them to the song list
    snapshot.forEach(this.addSong)
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false
    }
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name
      this.songs[i].genre = values.genre
    },
    removeSong(i) {
      this.songs.splice(i, 1)
    },
    addSong(document) {
      const song = {
        ...document.data(), // .data() gets the raw data but not the ID
        docID: document.id
      }

      this.songs.push(song)
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next()
      return
    }

    const leave = confirm('You have unsaved changes. Are you sure you want to leave?')
    next(leave)
  }
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads()

  //   next()
  // }
  // beforeRouteEnter(to, from, next) {
  //   const store = useUserStore()

  //   if (store.userLoggedIn) {
  //     next()
  //   } else {
  //     next({ name: 'home' })
  //   }
  // }
}
</script>

<style lang="scss" scoped></style>
