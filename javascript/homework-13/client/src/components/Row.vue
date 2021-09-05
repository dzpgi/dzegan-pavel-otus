<template>
  <div class="row"><slot></slot></div>
</template>

<style scoped>
  .row {
    position: fixed;
    bottom: v-bind(bottomPosition);
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
</style>

<script>
import { computed } from 'vue'

export default ({
  name: 'Row',
  props: {
    bottom: Boolean,
    position: String,
    count: Number,
    split: String,
    side: String
  },
  setup (props) {
    const bottomPosition = computed(() => props.bottom ? '70px' : null)
    return {
      bottomPosition
    }
  }
})
</script>
