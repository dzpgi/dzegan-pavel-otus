<template>
  <div v-if="taskType">
    <table>
      <tr>

        <td><Button :text="!isRunningGame? 'Запустить игру': 'Остановить игру'" @click="doRunGame(!isRunningGame)"  /></td>
        <td v-if="isRunningGame" :style="timeStyle">
          Оставшееся время: {{formattedTime}}
        </td>
        <td v-if="correctTaskCount && isRunningGame">
          Количество решенных задач: {{correctTaskCount}}
        </td>
      </tr>
    </table>

    <br />

    <table>
      <tr>
        <td><Field ref="a" id="a" v-model:value="fields.a.value" :autofocus="fields.a.focus" @focus="onFieldFocus" :disabled="fields.a.disabled" :valid="fields.a.valid" /></td>
        <td>{{taskType.print}}</td>
        <td><Field ref="b" id="b" v-model:value="fields.b.value" :autofocus="fields.b.focus" @focus="onFieldFocus" :disabled="fields.b.disabled" :valid="fields.b.valid" /></td>
        <td>=</td>
        <td><Field ref="c" id="c" v-model:value="fields.c.value" :autofocus="fields.c.focus" @focus="onFieldFocus" :disabled="fields.c.disabled" :valid="fields.c.valid" /></td>
        <td>
          <Button text="←" @click="doClearDigit"  color="Salmon"       title="Удалить символ" />&nbsp;
          <Button text="✔" @click="doCheckTask"   color="YellowGreen"  title="Проверить" :disabled="focusedField? false: true" />&nbsp;
          <Button text="»" @click="doRefreshTask" color="YellowGreen"  title="Обновить задание" />
        </td>
      </tr>
    </table>

    <br />

    <table>
      <tr>
        <td><Button @click="doPrintDigit(1)" text="1" /></td>
        <td><Button @click="doPrintDigit(2)" text="2" /></td>
        <td><Button @click="doPrintDigit(3)" text="3" /></td>
      </tr>
      <tr>
        <td><Button @click="doPrintDigit(4)" text="4" /></td>
        <td><Button @click="doPrintDigit(5)" text="5" /></td>
        <td><Button @click="doPrintDigit(6)" text="6" /></td>
      </tr>
      <tr>
        <td><Button @click="doPrintDigit(7)" text="7" /></td>
        <td><Button @click="doPrintDigit(8)" text="8" /></td>
        <td><Button @click="doPrintDigit(9)" text="9" /></td>
      </tr>
      <tr>
        <td><Button @click="doPrintDigit(0)" text="0" /></td>
        <td><Button @click="doPrintDigit('.')" text="." /></td>
        <td><Button @click="doPrintDigit('-')" text="–" /></td>
      </tr>
    </table>
  </div>
  <div v-else class="error">
    <b>Не выбран тип задания!</b>
  </div>
</template>

<style scoped>
  td {
    vertical-align: top;
  }
  .error {
    color:red;
  }
</style>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import Button from '@/components/Button.vue'
import Field from '@/components/Field.vue'
export default {

  components: { Button, Field },
  beforeRouteEnter: function () {
    console.log('Переход на вкладку GAME', arguments) // ajax
  },
  setup () {
    const store = useStore()

    const fields = ref({
      a: { index: 0 },
      b: { index: 1 },
      c: { index: 2 }
    })

    const formatTime = function (ms) {
      return Math.floor(ms / 60000) + ':' + ((ms % 60000) / 1000).toFixed(0)
    }
    const isRunningGame = ref(false)
    const curentTime = ref(store.state.settings.time)
    const formattedTime = ref()
    const timeStyle = ref()

    const doRunGame = function (start) {
      const taskCount = !start ? store.state.taskCnt : (isRunningGame.value ? store.state.taskCnt + 1 : 1)
      store.commit('setTaskCnt', taskCount)
      start = curentTime.value <= 0 ? false : start
      if (start) doRefreshTask()
      timeStyle.value = curentTime.value <= 15000 ? 'color: red' : null
      curentTime.value = start === false ? store.state.settings.time : curentTime.value
      isRunningGame.value = start || (start === false ? false : isRunningGame.value)
      if (!isRunningGame.value) return
      curentTime.value = start ? store.state.settings.time : curentTime.value - 1000
      formattedTime.value = formatTime(curentTime.value)
      setTimeout(doRunGame, 1000)
    }

    const taskType = ref()
    const correctTaskCount = ref()

    const doRefreshTask = function () {
      const types = store.state.settings.taskTypes
      correctTaskCount.value = isRunningGame.value ? correctTaskCount.value : null
      if (!Array.isArray(types)) return
      if (types.length < 1) return
      const index = Math.floor(Math.random() * types.length)
      taskType.value = types[index]
      const difficulty = store.state.settings.difficulty
      const focusedFieldIndex = Math.round(Math.random() * (Object.keys(fields.value).length - 1))
      for (const key in fields.value) {
        const field = fields.value[key]
        if (field.index === focusedFieldIndex) continue
        field.focus = false
        field.disabled = true
        field.value = Math.floor(Math.random() * 10 * difficulty)
        field.valid = null
      }
      const fieldId = Object.keys(fields.value)[focusedFieldIndex]
      const field = fields.value[fieldId]
      field.value = null
      field.disabled = false
      field.focus = true
      field.valid = null
      if (isRunningGame.value) store.commit('setTaskCnt', store.state.taskCnt + 1)
    }
    doRefreshTask()

    const doCheckTask = function () {
      const type = taskType.value.code
      let result = true

      const current = fields.value[focusedField.value.id]
      for (const key in fields.value) {
      // for (let key in fields.value) {
        const field = fields.value[key]
        if (field === current) continue
        field.valid = null
      }

      try {
        const a = parseFloat(fields.value.a.value)
        const b = parseFloat(fields.value.b.value)
        const c = parseFloat(fields.value.c.value)
        if (type === 'plus') result = (a) + (b) === c
        if (type === 'minus') result = (a) - (b) === c
        if (type === 'multiply') result = (a) * (b) === c
        if (type === 'divide') result = (a) / (b) === c
      } catch (e) {
        console.error(e)
        result = false
      }
      current.valid = !result ? 'Ошибка!' : true
      correctTaskCount.value = result ? correctTaskCount.value + 1 : correctTaskCount.value
      if (isRunningGame.value && result) {
        store.commit('setCorrectTaskCnt', correctTaskCount.value)
        doRefreshTask()
      }
    }

    const focusedField = ref()

    const doPrintDigit = function (digit) {
      const field = focusedField.value
      if (!field) return
      const value = field.value + digit
      fields.value[field.id].value = value
      fields.value[field.id].valid = null
    }

    const doClearDigit = function () {
      const field = focusedField.value
      if (!field) return
      fields.value[field.id].value = field.value.substring(0, field.value.length - 1)
      fields.value[field.id].valid = null
    }

    const onFieldFocus = function (e) {
      focusedField.value = e.target
    }

    return {
      correctTaskCount,
      isRunningGame,
      formattedTime,
      timeStyle,
      taskType,
      focusedField,
      fields,
      onFieldFocus,
      doPrintDigit,
      doCheckTask,
      doRefreshTask,
      doClearDigit,
      doRunGame
    }
  }
}
</script>
