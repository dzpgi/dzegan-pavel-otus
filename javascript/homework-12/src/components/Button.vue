<template>
  <a class="btn" href="#" @click.stop.prevent="onClick" :disabled="disabled">{{text}}</a>
</template>

<style scoped>
  .btn {
    border-radius: 4px;
    padding: 2px 6px;
    color: #ffffff;
    background:  v-bind(bgColor);
    cursor: pointer;
  }
</style>

<script>
/* eslint-disable */
import {ref, toRefs, reactive, watch, computed} from 'vue'
export default {
  name: 'Button',
  props: {
    text: String,
    color: String,
    disabled: String|Boolean
  },
  emits: ['click'],
  setup(props, { attrs, slots, emit }) {

    const { text, color, disabled } = toRefs(props)

    const bgColor = computed(()=>disabled.value === true || disabled.value === 'true'? 'silver': (color.value? color.value: 'SteelBlue'))

    const onClick = function(e) {
      if (!disabled.value) emit('click')
      // Дополнительная логика
    }
    return {
      bgColor,
      text,
      onClick,
    }
  }
}
</script>
