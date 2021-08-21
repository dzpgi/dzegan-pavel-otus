
<template>
  <div v-if="$store.state.correctTaskCnt && $store.state.taskCnt">
   Последний результат: Решено {{$store.state.correctTaskCnt}} из {{$store.state.taskCnt}}
  </div>
  <table>
    <tr>
      <td>Время на вопросы: </td>
      <td><Select :data="times" v-model:value="currentTime" /></td>
    </tr>
    <tr>
      <td>Сложность: </td>
      <td><Select :data="difficulties" v-model:value="currentDifficulty" /></td>
    </tr>
    <tr>
      <td>Типы заданий: </td>
      <td><Checkbox :data="taskTypes" v-model:value="currentTaskType" /></td>
    </tr>
  </table>
</template>

<script>
/* eslint-disable */
import {ref, reactive, watch, computed} from 'vue'
import { useStore } from 'vuex'
import Router from '../router/router'
import Select from '@/components/Select.vue'
import Checkbox from '@/components/Checkbox.vue'

export default {
  components: { Select, Checkbox },
  beforeRouteEnter: function() {
    console.log('Переход на вкладку SETTINGS', arguments) // ajax
  },
  setup (props) {
    const store = useStore()

    const times = ref([
      { code: 30000,  text: '00:30'},
      { code: 60000,  text: '01:00'},
      { code: 90000,  text: '01:30'},
      { code: 120000, text: '02:00'},
      { code: 150000, text: '02:30'},
      { code: 180000, text: '03:00'}
    ])
    const currentTime = ref(store.state.settings.time)
    const difficulties = ref([
      { code: 1, text: 'Легко'    },
      { code: 2, text: 'Нормально'},
      { code: 3, text: 'Сложно'   },
    ])
    const currentDifficulty = ref(store.state.settings.difficulty)
    const taskTypes = ref([
      { code: 'plus',     text: 'Суммирование', print: '+'},
      { code: 'minus',    text: 'Разность',     print: '−'},
      { code: 'multiply', text: 'Умножение',    print: '×'},
      { code: 'divide',   text: 'Деление',      print: '÷'},
    ])
    const currentTaskType = ref(store.state.settings.taskTypes)


    watch(currentTime, function(newValue, oldValue) {
      store.commit('setSetting', {time: newValue})
    })
    watch(currentDifficulty, function(newValue, oldValue) {
      store.commit('setSetting', {difficulty: newValue})
    })
    watch(currentTaskType, function(newValue, oldValue) {
      store.commit('setSetting', {taskTypes: newValue})
    }, {deep: true})

    const toPage = function() {
      Router.push('/about')
    }

    return {
      times,
      currentTime,
      difficulties,
      currentDifficulty,
      taskTypes,
      currentTaskType,
      toPage
    }
  }
}
</script>
