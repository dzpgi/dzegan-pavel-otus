<template>
  <Page :error="errorMessage" :move="move" v-model:loading="loading">
    <Dialog header="Авторизация" :visible="true" :closable="false">
      <span class="p-input-icon-left">
        <i class="pi pi-user" />
        <InputText placeholder="Имя пользователя" v-model="username" :class="invalidClass" />
      </span>
      <br />
      <br />
      <Password placeholder="Пароль" v-model="password" @keyup.enter="doLogin" :toggleMask="true" :class="invalidClass"/>
      <template #footer>
        <Button label="Вход" @click="doLogin" :disabled="loading" />
      </template>
    </Dialog>
  </Page>
</template>

<style scoped>
  .error-message {
    color: red;
    font-size: 12px;
  }
</style>

<script>
import { reactive, defineAsyncComponent, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { url } from '../hooks/service'

export default ({
  components: {
    Dialog: defineAsyncComponent(() => import('primevue/dialog')),
    Button: defineAsyncComponent(() => import('primevue/button')),
    InputText: defineAsyncComponent(() => import('primevue/inputtext')),
    Password: defineAsyncComponent(() => import('primevue/password')),
    Page: defineAsyncComponent(() => import('@/components/Page'))
  },

  setup () {
    const store = useStore()
    const route = useRoute()
    const query = reactive({
      invalidClass: null,
      username: null,
      errorMessage: null,
      loading: false,
      ...route.query
    })
    query.invalidClass = query.errorMessage ? 'p-invalid' : null

    const params = reactive({
      move: null,
      password: null,
      dialog: true
    })

    const doLogin = async function () {
      query.loading = true
      // Запрос к серверу
      const response = await fetch(
        `${url}/login`,
        {
          method: 'POST',
          headers: { accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: query.username, password: params.password })
        }
      )
      query.loading = false
      if (!response) {
        query.errorMessage = 'Сервер не отвечает'
        return
      }
      const result = await response.json()
      if (result.errorMessage) {
        query.errorMessage = result.errorMessage
        return
      }
      if (response && !response.ok) {
        query.errorMessage = `${response.statusText}: ${response.status} - ${response.url}`
        return
      }
      store.commit('setUser', result)
      params.move = {}

      // Или запрос к локальному промису
      /* ogin(query.username, params.password).then(function (response) {
        console.log('Login: Результат авторизации ', response)
        if (response.errorMessage) {
          query.loading = false
          query.errorMessage = response.errorMessage
          return
        }
        store.commit('setUser', response)
        params.move = {}
      }) */
    }

    return { ...toRefs(query), ...toRefs(params), doLogin }
  }
})
</script>
