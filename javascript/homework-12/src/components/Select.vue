<template>
  <select @change="onChange" v-model="selected">
    <option v-for="(record, index) in data" :key="index" :value="record[code]" >
      {{record[display]}}
    </option>
  </select>
</template>

<script>
/* eslint-disable */
import {ref, toRefs, reactive, watch, computed} from 'vue'

export default ({
  name: 'Select',
  emits: ['update:value'],
  props: {
    data: Array,
    value: String,
    code: {type: String, default: 'code'},
    display: {type: String, default: 'text'}
  },
  setup(props, { attrs, slots, emit }) {

    const { data, code, display, value} = toRefs(props)
    const selected = ref(value.value)
    const onChange = function(e) {
      value.value = e.target.value
      emit('update:value', e.target.value)
    }

    return {
      selected,
      value,
      data,
      code,
      display,
      onChange
    }
  },
})


</script>

