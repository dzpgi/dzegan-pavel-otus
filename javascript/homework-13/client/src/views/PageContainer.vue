<template>
  <component :is="pProcessPage"></component>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TabMenu from 'primevue/tabmenu'
import Chip from 'primevue/chip'
import Panel from 'primevue/panel'
import Toolbar from 'primevue/toolbar'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

export default ({
  components: {
    TabView,
    TabPanel,
    Panel,
    Toolbar,
    Card,
    Button,
    Menubar,
    TabMenu,
    Chip
  },
  setup () {
    const route = useRoute()
    const router = useRouter()

    window.appRouter = router

    // При открытии нового роута отображаем страницу заданную в нем
    const pProcessPage = defineAsyncComponent({
      loader: function () {
        return new Promise(function (resolve, reject) {
          const url = route.params.page
          const path = Array.isArray(url) ? url.join('/') : url
          console.log('PageContainer: Загрузка ', path)
          let page = null
          try {
            page = require(`../${path}`)
          } catch (e) {
            console.error(e)
            page = require('../pages/Empty')
          }
          resolve(page)
        })
      }
    })

    return {
      pProcessPage
    }
  }
})
</script>
