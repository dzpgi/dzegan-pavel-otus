import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    direction: {
      page: null,
      query: null
    },
    history: []
  },
  getters: { },
  mutations: {
    addHistory (state, direction) {
      if (!Array.isArray(state.history)) state.history = []
      state.history.push(direction)
    },
    setUser (state, user) {
      state.user = user
    },
    setDirection (state, direction) {
      state.direction = direction
    }
  },
  actions: { },
  modules: { }
})
