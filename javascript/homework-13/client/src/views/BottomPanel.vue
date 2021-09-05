<template>
  <div v-if="$store.state.user" class="bottom-panel">
    <br/>
    <Button label="История выполнения" @click="toPage('/pages/ProcessHistory')" />
  </div>
</template>

<style scoped>
  .bottom-panel {
    position: fixed;
    bottom: 0;
    height: 50px;
    display: flex;
    /* justify-content: space-around; */
    background-color: var(--blue-500);
    left:0;
    width: 100%;
  }
</style>

<script>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

export default ({
  name: 'BottomPanel',
  components: { Button },
  setup () {
    const router = useRouter()

    const toPage = function (path) {
      router.push({ path })
    }

    return {
      toPage
    }
  }
})
</script>
