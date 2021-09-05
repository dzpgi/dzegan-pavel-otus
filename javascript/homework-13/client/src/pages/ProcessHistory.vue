<template>
  <Page >
    <DataTable :value="directions" responsiveLayout="scroll" :paginator="true" :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          :rowsPerPageOptions="[10,20,50]">
        <Column field="time" header="Время">
          <template #body="record" dataType="date">
            {{dateFormat(record.data.time)}}
          </template>
        </Column>
        <Column field="action" header="Действие"></Column>
        <Column field="page" header="Страница"></Column>
        <Column field="query" header="Параметры"></Column>
    </DataTable>
    <div class="to-right-panel">
      <Button class="p-button-rounded" @click="$router.back()" icon="pi pi-arrow-left" />
    </div>
    <br/>
    <br/>
  </Page>
</template>

<style scoped>
  .to-right-panel {
    position: fixed;
    top: 100px;
    right: 10px;
  }
</style>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import Page from '@/components/Page'

export default ({
  name: 'ProcessHistory',
  components: { Page, Button, DataTable, Column },
  setup () {
    const store = useStore()

    const directions = ref(store.state.history).value.reverse()

    const dateFormat = function (value) {
      if (!value) return
      return `${value.getDate()}.${value.getMonth()}.${value.getFullYear()} ${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`
    }
    console.log('directions: ', directions)
    return {
      directions,
      dateFormat
    }
  }
})
</script>
