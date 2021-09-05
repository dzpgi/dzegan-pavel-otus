<template>
  <Page :message="message" :error="errorMessage" :move="move" v-model:loading="loading">
    <Scan @scan="onScan" :disabled="loading" />
  </Page>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import Scan from '@/components/Scan'
import Page from '@/components/Page'

export default ({
  components: { Page, Scan },

  setup () {
    const query = reactive({
      message: 'Отсканируйте ШК товара',
      errorMessage: null,
      loading: false,
      ...useRoute().query
    })

    const params = reactive({
      move: null
    })

    const onScan = function (e, value) {
      params.move = { barcode: value }
    }

    return { ...toRefs(query), ...toRefs(params), onScan }
  }
})
</script>
