import SongItem from '@/components/SongItem.vue'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'

describe('SongItem.vue', () => {
  test('renders author name', () => {
    const song = {
      display_name: 'test'
    }

    const wrapper = shallowMount(SongItem, {
      props: {
        song
      },
      global: {
        components: {
          RouterLink: RouterLinkStub
        }
      }
    })

    const compositionAuthor = wrapper.find('.text-white\\/70')

    expect(compositionAuthor.text()).toBe(song.display_name)
  })

  test('renders song.docID in id attribute', () => {
    const song = {
      docID: 'abc'
    }

    const wrapper = shallowMount(SongItem, {
      props: {
        song
      },
      global: {
        components: {
          RouterLinkStub
        }
      }
    })

    expect(wrapper.attributes().id).toBe(`song-id-${song.docID}`)
  })
})
