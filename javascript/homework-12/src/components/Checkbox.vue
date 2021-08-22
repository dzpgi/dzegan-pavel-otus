<template>
  <table>
    <tr v-for="(record, index) in data" :key="index" >
      <td>
        <input type="checkbox" :value="record[code]" :checked="record.checked" @input="onInput">
      </td>
      <td>
        {{record[display]}}
      </td>
    </tr>
  </table>
</template>

<script>
import { toRefs } from 'vue'

export default ({
  name: 'Checkbox',
  emits: ['update:value'],
  props: {
    data: { type: Array, default: () => [] },
    value: { type: Array, default: () => [] },
    code: { type: String, default: 'code' },
    display: { type: String, default: 'text' }
  },
  setup (props, { emit }) {
    const { data, code, value } = toRefs(props)
    // Дефолтным значением в массиве может быть простая строка (код) или объект (полноценная запись)
    // т.к. при смене значения компонент выбрасывает список всех выбранных значений,
    // то все примитивные значения преобразуем в запись/объект
    for (let i = 0; i < data.value.length; i++) {
      if (!Array.isArray(value.value)) break
      const record = data.value[i]
      for (let j = 0; j < value.value.length; j++) {
        const val = value.value[j]
        const simple = typeof (val) !== 'object'
        if (simple) {
          record.checked = record[code.value] === val
        } else {
          record.checked = record[code.value] === val[code.value]
        }
        if (record.checked) {
          value.value[j] = record
          break
        }
      }
    }

    const onInput = function (e) {
      const field = e.target
      const checked = field.checked
      const oldCheked = getChecked()
      if (oldCheked.length === 1 && oldCheked[0][code] === field.id) {
        field.value = true
        return
      }
      if (checked) {
        const record = data.value.find(item => item[code.value] === field.value)
        const exist = value.value.find(item => item[code.value] === field.value)
        if (!exist) value.value.push(record)
      } else {
        const index = value.value.findIndex(item => item[code.value] === field.value)
        value.value.splice(index, 1)
      }
      emit('update:value', value.value)
      emit('checked', value.value)
    }

    const getChecked = function () {
      if (!Array.isArray(data.value)) return []
      const result = data.value.filter(record => record.checked)
      return result
    }

    return {
      onInput
    }
  }
})
</script>
