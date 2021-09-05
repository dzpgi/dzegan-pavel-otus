<template>
  <Page :message="message" :error="errorMessage" v-model:loading="loading" :move="move" >

    <div class="panel">
      <div class="left">
        <label for="palletHeight">Высота поддона:</label>
      </div>
      <div class="right">
        <InputNumber v-model="palletHeight" @input="palletHeight = $event.value" suffix=" см" id="palletHeight" style="width:100%" :min="0" showButtons buttonLayout="horizontal" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
      </div>
    </div>
    <br />
    <br />

    <div class="panel">
      <div class="left">
        <label for="palletstd">Тип поддона:</label>
      </div>
      <div class="panel-item right">
        <RadioButton name="palletstd" value="1" v-model="palletstd" />Стандарный<br/><br/>
        <RadioButton name="palletstd" value="0" v-model="palletstd" />Нестандарный<br/>
      </div>
    </div>
    <br />
    <br />

    <div class="panel">
      <div class="left">
        <label for="palletstd">Тип товара:</label>
      </div>
      <div class="panel-item right">
        <RadioButton name="qualityArt" value="1" v-model="qualityArt" />Качественный<br/><br/>
        <RadioButton name="qualityArt" value="0" v-model="qualityArt" />Некачественный<br/>
      </div>
    </div>
    <br />
    <br />

    <div class="panel">
      <div class="left">
        <label for="wholedefect">Целая паллета брака:</label>
      </div>
      <div class="panel-item right">
        <InputSwitch v-model="wholedefect" id="wholedefect" />
      </div>
    </div>
    <br />

    <div class="panel">
      <div class="left">
        <label for="palletCnt">Количество паллет:</label>
      </div>
      <div class="right">
        <InputNumber v-model="palletCnt" @input="palletCnt = $event.value" id="palletCnt" style="width:100%" :min="0" showButtons buttonLayout="horizontal" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
      </div>
    </div>
    <br />

    <div class="panel">
      <div class="left">
        <label for="unitCnt">Количество:</label>
      </div>
      <div class="right">
        <InputNumber v-model="unitCnt" @input="unitCnt = $event.value" id="unitCnt" style="width:100%" :min="0" showButtons buttonLayout="horizontal" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
      </div>
    </div>
    <br />

    <div class="panel" v-if="unit === 'unit'">
      <div class="left">
        <label for="packing">Штук в коробке:</label>
      </div>
      <div class="right">
        <InputNumber v-model="packing" @input="packing = $event.value" id="packing" style="width:100%" :min="0" showButtons buttonLayout="horizontal" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" :class="invalidPacking" />
      </div>
      <br />
    </div>

    <div class="panel" v-if="unit === 'box'">
      <div class="left">
        <label for="blockInBoxCnt">Количество блоков в коробке:</label>
      </div>
      <div class="right">
        <InputNumber v-model="blockInBoxCnt" @input="blockInBoxCnt = $event.value" id="blockInBoxCnt" style="width:100%" :min="0" showButtons buttonLayout="horizontal" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" :class="invalidBlockInBoxCnt" />
      </div>
      <br />
    </div>

    <div class="panel" v-if="unit === 'block'">
      <div class="left">
        <label for="unitInBlockCnt">Количество штук в блоке:</label>
      </div>
      <div class="right">
        <InputNumber v-model="unitInBlockCnt" @input="unitInBlockCnt = $event.value" id="unitInBlockCnt" style="width:100%" :min="0" showButtons buttonLayout="horizontal" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" :class="invalidUnitInBlockCnt" />
      </div>
    </div>
    <br />

    <div class="panel">
      <div class="left">
        <label for="units">Выбираемый тип позиции:</label>
      </div>
      <div class="right">
        <Dropdown id="units" v-model="unit" :options="units" optionLabel="name" optionValue="code" :loading="units.length < 1? true: false" style="width: 100%" />
      </div>
    </div>
    <br />

    <Row :bottom="true" class="panel">
      <Button label="Вернуться" @click="doBack" class="p-button-warning" :disabled="disableBack" />
      <Button label="ТП пришла в коробках" @click="doArtInBlock" :disabled="disableArt" />
      <Button label="Подтвердить" @click="doNext" class="p-button-success" :disabled="disableNext" />
    </Row>

  </Page>
</template>

<style scoped>
  .art-name {
    width: 100%;
    background-color:  var(--green-200)
  }
  .panel {
    display: flex;
  }
  .left {
    width: 40%
  }
  .right {
    width: 60%
  }
  .panel-item {
    display: inline;
    text-align: left;
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
import { url } from '@/hooks/service'

export default ({
  components: {
    InputNumber: defineAsyncComponent(() => import('primevue/inputnumber')),
    InputSwitch: defineAsyncComponent(() => import('primevue/inputswitch')),
    Button: defineAsyncComponent(() => import('primevue/button')),
    Dropdown: defineAsyncComponent(() => import('primevue/dropdown')),
    RadioButton: defineAsyncComponent(() => import('primevue/radiobutton')),

    Row: defineAsyncComponent(() => import('@/components/Row')),
    Page: defineAsyncComponent(() => import('@/components/Page'))
  },

  setup () {
    const query = reactive({
      message: 'Введите количество',
      units: [],
      unit: 'block',
      palletHeight: 0,
      palletCnt: 0,
      palletstd: '1',
      qualityArt: '1',
      wholedefect: true,
      unitCnt: null,
      packing: null,
      blockInBoxCnt: null,
      unitInBlockCnt: null,
      invalidPacking: true,
      invalidBlockInBoxCnt: true,
      invalidUnitInBlockCnt: true,
      errorMessage: null,
      loading: true,
      ...useRoute().query
    })
    if (query.units.length < 1) {
      // Запрос к серверу
      const loadUnits = async function () {
        const response = await fetch(`${url}/units`)
        if (!response) return
        const result = await response.json()
        if (result.errorMessage) {
          query.errorMessage = result.errorMessage
          return
        }
        if (response && !response.ok) {
          query.errorMessage = `${response.statusText}: ${response.status} - ${response.url}`
          return
        }
        query.units = result
        query.loading = false
      }
      loadUnits()

      // Или запрос к локальному промису
      /* getUnits().then(function (response) {
        query.units = response
        query.loading = false
      }) */
    }
    query.invalidPacking = computed(() => !query.packing ? 'p-invalid' : null)
    query.invalidBlockInBoxCnt = computed(() => !query.blockInBoxCnt ? 'p-invalid' : null)
    query.invalidUnitInBlockCnt = computed(() => !query.unitInBlockCnt ? 'p-invalid' : null)
    query.disableBack = computed(() => query.loading)
    query.disableArt = computed(() => query.loading)
    query.disableNext = computed(() => {
      return query.loading || (query.unit === 'unit' && query.invalidPacking) || (query.unit === 'box' && query.invalidBlockInBoxCnt) || (query.unit === 'block' && query.invalidUnitInBlockCnt)
    })

    const params = reactive({
      move: null
    })

    const doBack = function () {
      params.move = { wps$direction: 'back' }
    }

    const doArtInBlock = function () {
      params.move = { wps$direction: 'packagingProblem' }
    }

    const doNext = function () {
      const data = {}
      data.wps$direction = 'next'
      data.palletHeight = query.palletHeight
      data.palletCnt = query.palletCnt
      data.palletstd = query.palletstd
      data.qualityArt = query.qualityArt
      data.wholedefect = query.wholedefect
      data.unitCnt = query.unitCnt
      if (query.unit === 'unit') data.packing = query.packing
      if (query.unit === 'box') data.packing = query.packing
      if (query.unit === 'block') data.packing = query.packing
      data.qualityArt = query.qualityArt
      params.move = data
    }

    return { ...toRefs(query), ...toRefs(params), doBack, doArtInBlock, doNext }
  }
})
</script>
