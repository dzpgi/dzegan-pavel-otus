<template>
  <ProgressBar v-if="pLoading" mode="indeterminate" style="height: .1em" />
  <Message :closable="false" v-if="pMessage" >
    {{pMessage}}
  </Message>
  <Message :closable="false" v-if="pError" severity="error">
    {{pError}}
  </Message>
  <Message :closable="false" v-if="pWarning" severity="warning">
    {{pWarning}}
  </Message>
  <Dialog :visible="pException && pException.length>0? true: false" :closable="false" :style="{width: '50vw'}" :modal="true">
      <p class="p-m-0">{{pException}}</p>
      <template #footer>
          <Button label="Закрыть" icon="pi pi-times" @click="closeDialog" class="p-button-text"/>
      </template>
  </Dialog>
  <slot></slot>
</template>

<script>
import { watch, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import Message from 'primevue/message'
import ProgressBar from 'primevue/progressbar'
import { url } from '../hooks/service'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

export default ({
  name: 'Page',
  emits: ['moved', 'update:loading'],
  components: { ProgressBar, Message, Dialog, Button },
  props: {
    loading: { type: Boolean, default: false },
    message: { type: [String, Boolean], default: '' },
    error: { type: [String, Boolean], default: '' },
    warning: { type: [String, Boolean], default: '' },
    move: Object
  },
  setup (props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const page = route.path.indexOf('/') === 0 ? route.path.substring(1) : route.path
    const query = route.query
    console.log('Page: Текущая страница ', page)
    console.log('Page: Текущие url параметры ', query)

    if (!store.state.direction || !store.state.direction.page) store.commit('setDirection', { page, query })

    const pLoading = ref(props.loading)
    watch(() => props.loading, value => { pLoading.value = value })

    const pMessage = ref(props.message)
    watch(() => props.message, value => { pMessage.value = value })

    const pError = ref(props.error)
    watch(() => props.error, value => { pError.value = value })

    const pWarning = ref(props.warning)
    watch(() => props.warning, value => { pWarning.value = value })

    const pException = ref('')

    const moveData = computed(() => props.move)
    watch(moveData, async function () {
      pLoading.value = true
      emit('update:loading', pLoading.value)
      // Подготовка параметров
      const data = {
        userId: store.state.user ? store.state.user.userId : null
      }
      Object.keys(moveData.value).forEach(key => { data[key] = moveData.value[key] })
      store.commit('addHistory', { page: store.state.direction.page, query: data, action: 'Отправка', time: new Date() })

      if (!store.state.direction || !store.state.direction.page) {
        pLoading.value = false
        emit('update:loading', pLoading.value)
        emit('moved', { errorMessage: pException.value })
        pException.value = 'Не определена текущая страница'
        pError.value = props.error !== false ? 'Не определена текущая страница' : pError.value
        return
      }

      // Запрос к серверу
      const response = await fetch(
        `${url}/move`,
        {
          method: 'POST',
          headers: { accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ page: store.state.direction.page, params: data })
        }
      )
      pLoading.value = false
      emit('update:loading', pLoading.value)
      if (!response) {
        pError.value = 'Сервер не отвечает'
        return
      }

      if (response && !response.ok) {
        pException.value = `${response.statusText}: ${response.status} - ${response.url}`
        return
      }

      const result = await response.json()
      if (result.errorMessage) {
        pError.value = props.error !== false ? result.errorMessage : pError.value
        return
      }

      pError.value = (!result || !result.page) && props.error !== false ? 'Нет направления по текущему действию' : pError.value
      store.commit('setDirection', result)
      emit('moved', result)

      if (result.page) {
        store.commit('addHistory', { page: result.page, query: result.query, action: 'Прием', time: new Date() })
        router.push({ path: `/${result.page}`, query: result.query })
      }

      // Или запрос к локальному промису
      /* move(store.state.direction.page, data).then(function (response) {
        console.log('Page: Результат перехода ', response)
        pLoading.value = false
        pError.value = (!response || !response.page) && props.error !== false ? 'Нет направления по текущему действию' : pError.value

        store.commit('setDirection', response)
        emit('update:loading', pLoading.value)
        emit('moved', response)

        if (response && response.page) {
          store.commit('addHistory', { page: response.page, query: response.query, action: 'Прием', time: new Date() })
          router.push({ path: `/${response.page}`, query: response.query })
        }
      }) */
    })

    const closeDialog = function (e) {
      pException.value = null
      // Логирование
    }

    return {
      pLoading,
      pMessage,
      pError,
      pWarning,
      pException,
      closeDialog
    }
  }
})
</script>
