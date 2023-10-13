<template>
  <main>
    <section
      class="w-full mb-8 py-14 text-center text-white relative bg-gradient-to-b from-transparent via-pink-800/50 to-transparent"
    >
      <div class="container mx-auto flex items-center">
        <button
          id="play-btn"
          type="button"
          class="h-24 w-24 text-3xl bg-pink-600 hover:bg-pink-700 active:bg-pink-900 text-white rounded-full focus:outline-none"
          @click.prevent="playing ? toggleAudio() : newSong(song)"
        >
          <i
            class="fas"
            :class="{
              'fa-play': !playing,
              'fa-pause': playing && current_song.modified_name == song.modified_name
            }"
          ></i>
        </button>
        <div class="text-left ml-8">
          <div class="text-3xl tracking-wide">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section id="comments" class="container mx-auto mt-6">
      <div class="bg-pink-900/70 rounded relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-500/80">
          <!-- Comment Count -->
          <span class="text-white">Comments ({{ song.comment_count }})</span>
          <i class="fa fa-comments float-right text-white text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="comment_show_alert"
            :class="comment_alert_variant"
          >
            {{ comment_alert_message }}
          </div>
          <VeeForm :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
            <VeeField
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></VeeField>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-pink-600 hover:bg-pink-700 active:bg-pink-800 block"
              :disabled="comment_in_submission"
            >
              Submit
            </button>
          </VeeForm>
          <!-- Sort Comments -->
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            v-model="sort"
          >
            <option value="desc">Latest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </div>
    </section>
    <ul class="container mx-auto">
      <li
        class="p-6 bg-pink-900/70 border-b border-gray-100/20 last:border-b-0 text-white"
        v-for="comment in sortedComments"
        :key="comment.docID"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ formatDate(comment.datePosted) }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { songsCollection, auth, commentsCollection } from '@/includes/firebase'
import { mapState, mapActions } from 'pinia'
import useUserStore from '@/stores/user'
import usePlayerStore from '@/stores/player'
import format from 'date-fns/format'

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      comments: [],
      schema: {
        comment: 'required|min:3'
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Please wait! Your comment is being submitted.',
      sort: 'desc'
    }
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    ...mapState(usePlayerStore, ['playing', 'current_song']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === 'desc') {
          return new Date(b.datePosted) - new Date(a.datePosted)
        }

        return new Date(a.datePosted) - new Date(b.datePosted)
      })
    }
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return
      }

      this.$router.push({
        query: {
          sort: newVal
        }
      })
    }
  },
  async created() {
    const docSnapshot = await songsCollection.doc(this.$route.params.id).get()

    if (!docSnapshot.exists) {
      this.$router.push({ name: 'home' })
      return
    }

    const { sort } = this.$route.query

    this.sort = sort === 'desc' || sort === 'asc' ? sort : 'desc'

    this.song = docSnapshot.data()
    this.getComments()
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong', 'toggleAudio']),
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true
      this.comment_show_alert = true
      this.comment_alert_variant = 'bg-blue-500'
      this.comment_alert_message = 'Please wait! Your comment is being submitted.'

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid
      }

      await commentsCollection.add(comment)

      this.song.comment_count += 1

      await songsCollection.doc(this.$route.params.id).update({
        comment_count: this.song.comment_count
      })

      this.comment_in_submission = false
      this.comment_show_alert = true
      this.comment_alert_variant = 'bg-green-500'
      this.comment_alert_message = 'Comment added!'

      resetForm()
      this.getComments()
    },
    async getComments() {
      const snapshots = await commentsCollection.where('sid', '==', this.$route.params.id).get()

      this.comments = []

      snapshots.forEach((doc) => {
        this.comments.push({
          ...doc.data(),
          docID: doc.id
        })
      })
    },
    formatDate(dateString) {
      return format(new Date(dateString), 'EEEE, d MMMM yyyy')
    }
  }
}
</script>

<style lang="scss" scoped></style>
