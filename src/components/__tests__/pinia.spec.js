import { setActivePinia, createPinia } from 'pinia'
import useUserStore from '@/stores/user'

describe('stores', () => {
  vi.mock('@/includes/firebase', () => ({
    auth: {
      signInWithEmailAndPassword: () => Promise.resolve({})
    }
  }))

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('authenticates user', async () => {
    const store = useUserStore()

    expect(store.userLoggedIn).not.toBe(true)

    await store.authenticate({})

    expect(store.userLoggedIn).toBe(true)
  })
})
