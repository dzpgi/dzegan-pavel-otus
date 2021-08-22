<template>
  <div>
    <input
      ref="field"
      :id="id"
      :value="value"
      @input="onInput"
      @focus="onFocus"
      :disabled="disabled"
      :autofocus="autofocus"
      class="field"
    >
    <div v-if="errorMessage" class="error">{{errorMessage}}</div>
    <div v-if="valid === 'true' || valid === true" class="correct">Верно</div>
  </div>
</template>

<style scoped>
  .field {
    border-style: solid;
    border-width: 1px;
    border-color: v-bind(borderColor);
  }
  .error {
    font-size: 10px;
    color: red;
  }
  .correct {
    font-size: 10px;
    color: green;
  }

</style>

<script>
import { ref, toRefs, computed } from 'vue'

export default {
  name: 'Field',
  emits: ['update:value', 'update:focus', 'focus'],
  props: {
    value: { type: [String, Number] },
    id: String,
    valid: { type: [String, Boolean] },
    disabled: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false }
  },
  mounted: function () {
    if (this.autofocus) this.$refs.field.focus()
  },
  updated: function () {
    if (this.autofocus) this.$refs.field.focus()
  },

  setup (props, { emit }) {
    const { value, valid } = toRefs(props)
    const field = ref()
    const borderColor = ref(valid.value === true || valid.value === 'true' ? 'green' : (valid.value ? 'red' : ''))

    const errorMessage = computed(function () {
      return typeof (valid.value) === 'string' && (valid.value !== 'true' || valid.value !== 'false') ? valid.value : null
    })

    const onInput = function (e) {
      value.value = e.target.value
      emit('update:value', e.target.value)
    }

    const onFocus = function (e) {
      emit('focus', e)
    }

    return {
      errorMessage,
      borderColor,
      field,
      onInput,
      onFocus
    }
  }
}
</script>
