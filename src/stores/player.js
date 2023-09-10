import { defineStore } from 'pinia'
import { Howl } from 'howler'
import helper from '@/includes/helper'

export default defineStore('player', {
  state: () => ({
    current_song: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%'
  }),
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing()
      }

      return false
    }
  },
  actions: {
    async newSong(song) {
      // Remove the loaded song
      if (this.sound instanceof Howl) {
        this.sound.unload()
      }

      this.current_song = song

      this.sound = new Howl({
        src: [song.url],
        html5: true
      })

      this.sound.play()

      this.sound.on('play', () => {
        // requestAnimationFrame calls a specified function before repainting/redrawing the UI
        // In our case, we update the seek position and the total duration of the music player
        requestAnimationFrame(this.progress)
      })
    },
    async toggleAudio() {
      if (!this.sound.playing) {
        return
      }

      if (this.sound.playing()) {
        this.sound.pause()
      } else {
        this.sound.play()
      }
    },
    progress() {
      this.seek = helper.formatTime(this.sound.seek())
      this.duration = helper.formatTime(this.sound.duration())

      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`

      if (this.sound.playing()) {
        // Call the function recursively to keep updating the seek time
        // if a song is playing
        requestAnimationFrame(this.progress)
      }
    },
    updateSeek(event) {
      if (!this.sound.playing) {
        return
      }

      const { x, width } = event.currentTarget.getBoundingClientRect()
      // We don't care about the vertical position as long as it's within the seek bar.
      // event.clientX is relative to the document so we need to offset it by the left most
      // position of the seek bar element.
      const clickX = event.clientX - x

      const percentage = clickX / width
      const seconds = this.sound.duration() * percentage

      // Move the current song's position to the specified value
      this.sound.seek(seconds)

      // Tell Howler to update the progress once the seek event is triggered
      this.sound.once('seek', this.progress)
    }
  }
})
