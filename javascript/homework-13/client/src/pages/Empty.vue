<template>
  <Page :error="errorMessage" :loading="loading">
    <Button label="Вернуться" @click="doBack" />
  </Page>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Page from '@/components/Page'
import Button from 'primevue/button'

export default ({
  components: { Page, Button },

  setup () {
    const query = reactive({
      errorMessage: 'Запрашиваемая страница отсутствует или содержит ошибки 😭',
      loading: false,
      ...useRoute().query
    })
    const router = useRouter()

    const doBack = function () {
      query.loading = true
      router.back()
    }

    return { ...toRefs(query), doBack }
  }
})
</script>
