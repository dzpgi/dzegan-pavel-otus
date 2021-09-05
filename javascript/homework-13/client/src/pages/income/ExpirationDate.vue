<template>
  <Page :message="message" :error="errorMessage" v-model:loading="loading" :move="move" >

    <div class="panel">
      <div style="width: 30%">
        <label for="dateexpire">Срок храненрия:</label>
      </div>
      <div style="width: 70%">
        <Calendar id="icon" class="invalidClass" v-model="dateexpire" @date-select="doCalc('dateexpire')" style="width: 100%" :class="invalidDateexpire" :showIcon="true" :manualInput="false" dateFormat="dd.mm.yy" />
      </div>
    </div>
    <br />

    <div class="panel">
      <div style="width: 30%;">
        <label for="expirecnt">Срок храненрия:</label>
      </div>
      <div style="width: 40%">
        <InputNumber v-model="expirecnt" @input="expirecnt = $event.value" @blur="doCalc('expirecnt', $event)" id="expirecnt" style="width:100%" :min="0" showButtons buttonLayout="horizontal" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
      </div>
      <div style="width: 30%" class="panel-item">
        <label for="expiretype" class="label">День </label>
        <InputSwitch v-model="expiretype" @change="doCalc('expiretype', $event)" id="datetype" />
        <label for="expiretype" class="label"> Месяц</label>
      </div>
    </div>
    <br />

    <div class="panel">
      <div style="width: 30%">
        <label for="dateproduct">Дата изготовдления:</label>
      </div>
      <div style="width: 70%">
        <Calendar id="icon" v-model="dateproduct" @date-select="doCalc('dateproduct')" style="width: 100%" :class="invalidDateproduct" :showIcon="true" :manualInput="false" dateFormat="dd.mm.yy" />
      </div>
    </div>
    <br />

    <Row :bottom="true">
      <div style="width: 50%"><Button label="Вернуться" @click="doBack" class="p-button-warning" :disabled="disableBack" /></div>
      <div style="width: 50%"><Button label="Продолжить" @click="doNext" class="p-button-success" :disabled="disableNext" /></div>
    </Row>

  </Page>
</template>

<style scoped>
  .panel {
    display: flex;
  }
  .panel-item {
    display: inline;
    text-align: right;
    vertical-align: top;
  }
  .label {
    display: inline;
    vertical-align: top;
  }
</style>

<script>
import { reactive, computed, toRefs, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { toDate } from '@/hooks/service'

export default ({
  components: {
    Calendar: defineAsyncComponent(() => import('primevue/calendar')),
    InputNumber: defineAsyncComponent(() => import('primevue/inputnumber')),
    InputSwitch: defineAsyncComponent(() => import('primevue/inputswitch')),
    Button: defineAsyncComponent(() => import('primevue/button')),
    Row: defineAsyncComponent(() => import('@/components/Row')),
    Page: defineAsyncComponent(() => import('@/components/Page'))
  },

  setup () {
    const query = reactive({
      message: 'Установить срок годности',
      errorMessage: null,
      dateexpire: null,
      expirecnt: 0,
      expiretype: true,
      dateproduct: 0,
      invalidDateexpire: null,
      invalidDateproduct: null,
      loading: false,
      ...useRoute().query
    })

    query.dateexpire = toDate(query.dateexpire)
    query.dateproduct = toDate(query.dateproduct)
    query.expiretype = query.expiretype === true || query.expiretype === 'true' || query.expiretype === '1'
    query.expirecnt = !isNaN(+query.expirecnt) ? (+query.expirecnt) : 0
    query.invalidDateexpire = computed(() => !query.dateexpire ? 'p-invalid' : null)
    query.invalidDateproduct = computed(() => !query.dateproduct ? 'p-invalid' : null)
    query.disableBack = computed(() => query.loading)
    query.disableNext = computed(() => query.loading || query.invalidDateexpire || query.invalidDateproduct)

    const params = reactive({
      move: null
    })

    const doCalc = function (current) {
      const isMonth = query.expiretype

      if ((current === 'dateexpire' || current === 'expirecnt') && query.dateexpire && query.expirecnt && !query.dateproduct) {
        const value = query.dateexpire
        if (isMonth) {
          value.setMonth(value.getMonth() - query.expirecnt)
        } else {
          value.setDate(value.getDate() - query.expirecnt)
        }
        query.dateproduct = new Date(value)
      } else if ((current === 'dateproduct' || current === 'expirecnt') && query.dateproduct && query.expirecnt && !query.dateexpire) {
        const value = query.dateproduct
        if (isMonth) {
          value.setMonth(value.getMonth() + query.expirecnt)
        } else {
          value.setDate(value.getDate() + query.expirecnt)
        }
        query.dateexpire = new Date(value)
      } else if ((current === 'dateexpire' || current === 'dateproduct') && query.dateexpire && query.dateproduct) {
        let value = null
        if (isMonth) {
          value = (query.dateexpire.getFullYear() * 12 + query.dateexpire.getMonth()) - (query.dateproduct.getFullYear() * 12 + query.dateproduct.getMonth())
        } else {
          value = Math.floor((query.dateexpire.getTime() - query.dateproduct.getTime()) / (1000 * 60 * 60 * 24))
        }
        query.expirecnt = value
      } else if (current === 'expiretype' && query.dateproduct && query.expirecnt) {
        const value = query.dateproduct
        if (isMonth) {
          value.setMonth(value.getMonth() + query.expirecnt)
        } else {
          value.setDate(value.getDate() + query.expirecnt)
        }
        query.dateexpire = new Date(value)
      } else if (current === 'expiretype' && query.dateexpire && !query.dateproduct && query.expirecnt) {
        const value = query.dateexpire
        if (isMonth) {
          value.setMonth(value.getMonth() - query.expirecnt)
        } else {
          value.setDate(value.getDate() - query.expirecnt)
        }
        query.dateproduct = new Date(value)
      } else if (current === 'expirecnt' && query.expirecnt && query.dateexpire && query.dateproduct) {
        const value = query.dateproduct
        if (isMonth) {
          value.setMonth(value.getMonth() + query.expirecnt)
        } else {
          value.setDate(value.getDate() + query.expirecnt)
        }
        query.dateexpire = new Date(value)
      }
    }

    const doNext = function () {
      params.move = {
        wps$direction: 'next',
        dateexpire: query.dateexpire,
        dateproduct: query.dateproduct
      }
    }

    const doBack = function () {
      params.move = { wps$direction: 'back' }
    }

    return { ...toRefs(query), ...toRefs(params), doNext, doBack, doCalc }
  }
})
</script>
