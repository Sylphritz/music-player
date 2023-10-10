import { shallowMount } from '@vue/test-utils'
import Home from '@/views/Home.vue'
import SongItem from '@/components/SongItem.vue'

describe('Home.vue', () => {
  const songs = [{}, {}, {}]
  test('renders list of songs', () => {
    const component = shallowMount(Home, {
      data() {
        return {
          songs
        }
      },
      global: {
        mocks: {
          $t: (message) => message
        }
      }
    })

    const items = component.findAllComponents(SongItem)

    expect(items).toHaveLength(songs.length)

    items.forEach((wrapper, index) => {
      expect(wrapper.props().song).toStrictEqual(songs[index])
    })
  })
})
