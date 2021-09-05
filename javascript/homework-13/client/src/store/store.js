/* eslint-disable */
import { createApp } from 'vue'
import { createStore } from 'vuex'
import { InjectionKey } from 'vue'

export default createStore({
  state: {
    user: null,
    direction: {
      page: null,
      query: null
    },
    history: [],
    settings: {

      myPage: null,
      time: 30000,
      difficulty: 2,
      // Несколько вариантов задать дефолтные значения:
      // Если типы заданы в простом формате, то приложение должно быть загружено с "Настроеки",
      // чекбоксы автоматически отформатируют их в полноценную запись.
      // Если приложение загружено из "Игра", то необходимо задать типы как полноценные записи,
      // для возможности пользоваться любым свойством типа (print)
      taskTypes: [
        //'plus',
        //{ code: 'divide'},
        { code: 'plus',     text: 'Суммирование', print: '+'},
        { code: 'multiply', text: 'Умножение',    print: '×'},
      ]
    },
    correctTaskCnt: null,
    taskCnt: null
  },
  getters: { },
  mutations: {
    addHistory(state, direction) {
      if (!Array.isArray(state.history)) state.history = []
      state.history.push(direction)
    },
    setUser(state, user) {
      state.user = user
    },
    setDirection(state, direction) {
      state.direction = direction
    },
    setSetting(state, setting) {
      if (setting.time)       state.settings.time       = setting.time
      if (setting.difficulty) state.settings.difficulty = setting.difficulty
      if (setting.taskTypes)  state.settings.taskTypes  = setting.taskTypes
    },
    setCorrectTaskCnt(state, value) {
      state.correctTaskCnt = value
    },
    setTaskCnt(state, value) {
      state.taskCnt = value
    }
  },
  actions: { },
  modules: { }
})
