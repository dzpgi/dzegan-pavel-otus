/* eslint-disable */
export const url = `${document.location.protocol}//${location.hostname}:3000`

const directions = [
  {
    page: 'pages/income/SiteScan',
    to: function(params) {
      if (params.barcode === '111') return {page: 'pages/income/ArtScan', query: {}}
      return  {page: 'pages/income/SiteScan', query: { errorMessage: 'Не удалось найти местоположение с данным ШК'}}
    }
  },
  {
    page: 'pages/income/ArtScan',
    to: function(params) {
      if (params.barcode === '222') return {page: 'pages/income/ExpirationDate', query: {}}
      return  {page: 'pages/income/ArtScan', query: { errorMessage: 'Не удалось найти товар с данным ШК'}}
    }
  },
  {
    page: 'pages/income/ExpirationDate',
    to: function(params) {
      if (params.wps$direction === 'back') return {page: 'pages/income/ArtScan'}
      if (!params.dateexpire) return {page: 'pages/income/ExpirationDate', query: { errorMessage: 'Не выбран срок храненрия'}}
      if (!params.dateproduct) return {page: 'pages/income/ExpirationDate', query: { errorMessage: 'Не выбрана дата изготовдления'}}
      return {page: 'pages/income/PalletInfo', query: { message: 'Действие выполнено успешно'}}
    }
  },
  {
    page: 'pages/income/PalletInfo',
    to: function(params) {
      if (params.wps$direction === 'back') return { page: 'pages/income/ExpirationDate' }
      if (params.wps$direction === 'packagingProblem') return { page: 'pages/income/ArtScan' }
      if (params.wps$direction === 'next') return { page: 'pages/income/SiteScan' }
    }
  },
]

const rnd = function (max) {
  return Math.floor((Math.random()*(max? max: 4000)) + 0)
}

export const login = function(username, password) {
  console.log('Service: Авторизация с параметрами ', username, password)
  const result = username === 'admin' && password === '111'? { fullName: 'Иванов И.И.', userId: 'ivanovii' }: { errorMessage: 'Неверный логин или пароль' }
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(result)
    }, rnd())
  })
}

export const move = function(page, params) {
  console.log('Service: Переход с параметрами ', page, params)
  let nextDiretion
  for (let i=0; i<directions.length; i++) {
    const direction = directions[i]
    if (direction.page !== page) continue
    nextDiretion = direction.to(params)
    break
  }
  nextDiretion = nextDiretion? nextDiretion: directions[0]

  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(nextDiretion)
    }, rnd())
  })
}

export const getUnits = function() {
  const units = [
    { code: 'box', name: 'коробка' },
    { code: 'unit', name: 'штука'  },
    { code: 'block', name: 'блок'  }
  ]

  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(units)
    }, rnd())
  })
}

export const toDate = function(value) {

  if (!value || typeof(value) !== 'string') return

  const numbers = value.split('.').map(Number).filter(v => !isNaN(v));
  //console.log('toDate = ', numbers)
  if (numbers.length !== 3) return
  return new Date(numbers[2], numbers[1]-1, numbers[0])
}
