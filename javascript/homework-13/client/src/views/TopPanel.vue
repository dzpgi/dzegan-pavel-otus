<template>
  <div v-if="$store.state.user" class="top-panel">
    <div @click="onUserClick"><i class="pi pi-user" /> {{fullName}}</div>
    <Dialog :visible="showLogout" :closable="false" :style="{width: '50vw'}" :modal="true">
      <p class="p-m-0">Завершить сеанс пользователя {{$store.state.user.fullName}}?</p>
      <template #footer>
          <Button label="Да" icon="pi pi-sign-out" @click="doLogaut(true)" class="p-button-text p-button-danger"/>
          <Button label="Нет" @click="doLogaut(false)" class="p-button-text"/>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
  .top-panel {
    border: 1px solid #dee2e6;
    padding: 1rem;
    background: #f8f9fa;
    color: var(--bluegray-600);
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
    text-align: left;
  }
</style>

<script>
import { watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

export default ({
  name: 'TopPanel',
  components: { Dialog, Button },
  setup () {
    const router = useRouter()

    const store = useStore()
    const showLogout = ref(false)

    const fullName = ref()
    watch(
      () => store.state.user,
      user => { fullName.value = user ? user.fullName : null }
    )

    const onUserClick = function (e) {
      showLogout.value = true
    }

    const doLogaut = function (value) {
      showLogout.value = false
      if (!value) return
      store.commit('setUser', null)
      router.push({ path: '/pages/Login' })
    }

    return {
      showLogout,
      fullName,
      onUserClick,
      doLogaut
    }
  }
})
</script>
