<template>
  <span class="p-input-icon-left">
    <i class="pi pi-align-justify rotate-icon" />
    <InputText ref="field" type="text" v-model="value" :disabled="disabled" :placeholder="placeholder" @keydown="onFieldKeyDown" />
  </span>
  <Button v-if="manual" @click="onClick" :disabled="disabled" icon="pi pi-arrow-right" class="p-mr-2"  />
</template>

<style scoped>
  .rotate-icon {
    transform: rotate(270deg);
  }
</style>

<script>
import { ref, defineAsyncComponent, onBeforeUnmount } from 'vue'

export default {
  name: 'Scan',
  components: {
    Button: defineAsyncComponent(() => import('primevue/button')),
    InputText: defineAsyncComponent(() => import('primevue/inputtext'))
  },

  emits: ['scan'],
  props: {
    manual: { type: Boolean, default: true },
    placeholder: { type: String, default: 'Отсканируйте Штрих - код' },
    disabled: Boolean
  },

  setup (props, { emit }) {
    const startScanCode = 45
    const endScanCode = 13
    const field = ref()
    const value = ref()

    const onClick = function (e) {
      if (props.disabled) return
      emit('scan', e, value.value)
    }

    const onPageKeyDown = function (e) {
      if (!field.value || !field.value.$el) {
        console.error('Обработчик сканера запрашивает несуществующий элемент')
        return
      }
      if (props.disabled) return
      if (e.keyCode === startScanCode && e.target !== field.value.$el) field.value.$el.focus()
    }

    onBeforeUnmount(function () {
      window.removeEventListener('keydown', onPageKeyDown)
    })

    const onFieldKeyDown = function (e) {
      if (props.disabled) return
      if (e.keyCode === endScanCode) emit('scan', e, value.value)
    }

    window.addEventListener('keydown', onPageKeyDown)

    return {
      field,
      value,
      onFieldKeyDown,
      onClick
    }
  }
}
</script>
