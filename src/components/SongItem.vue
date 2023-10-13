<template>
  <li
    class="flex justify-between items-center p-3 pl-6 transition duration-100 hover:bg-gray-700/50"
    :id="`song-id-${song.docID}`"
  >
    <div>
      <RouterLink
        :to="{ name: 'song', params: { id: song.docID } }"
        class="font-bold block text-white composition-name"
        >{{ song.modified_name }}</RouterLink
      >
      <span class="text-white/70 text-sm">{{ song.display_name }}</span>
    </div>

    <div class="text-white text-lg">
      <!--
          `custom` tells the rounter-link component to not generate an <a> tag.
          `v-slot` provides you with some resources to use inside the component.
          Available resources: isActive, href, navigate
          In this case, we want the navigate function.

          Read more here: https://router.vuejs.org/guide/advanced/extending-router-link.html#Extending-RouterLink
      -->
      <RouterLink
        custom
        :to="{ name: 'song', params: { id: song.docID }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <!-- Run the `navigate()` function on click to push the new route. -->
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-white"></i>
          {{ song.comment_count }}
        </span>
      </RouterLink>
    </div>
  </li>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  name: 'SongItem',
  props: {
    song: {
      type: Object,
      required: true
    }
  },
  components: { RouterLink }
}
</script>
