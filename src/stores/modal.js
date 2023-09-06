import { defineStore } from 'pinia'

export default defineStore('modal', {
  // State of the store (eg. the data that is stored)
  state: () => ({
    isOpen: false
  }),
  getters: {
    hiddenClass(state) {
      return state.isOpen ? '' : 'hidden'
    }
  }
})
