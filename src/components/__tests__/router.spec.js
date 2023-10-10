import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import SongItem from '@/components/SongItem.vue'

describe('Router', () => {
  test('renders router link', () => {
    const song = {
      docID: 'abc',
      modified_name: 'test',
      display_name: 'test',
      comment_count: 5
    }

    const wrapper = shallowMount(SongItem, {
      props: { song },
      global: {
        components: {
          RouterLinkStub
        }
      }
    })

    expect(wrapper.findComponent(RouterLinkStub).props().to).toEqual({
      name: 'song',
      params: { params: { id: song.docID } }
    })
  })
})
