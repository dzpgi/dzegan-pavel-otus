const express = require('express')
const cors = require('cors')
const { readFileSync } = require('fs')

const app = express()
app.use(express.json())
app.use(cors())

const directions = [
  {
    page: 'pages/income/SiteScan',
    to: function (params) {
      if (params.barcode === '111') return { page: 'pages/income/ArtScan', query: {}}
      return  { page: 'pages/income/SiteScan', query: { errorMessage: 'Не удалось найти местоположение с данным ШК' } }
    }
  },
  {
    page: 'pages/income/ArtScan',
    to: function (params) {
      if (params.barcode === '222') return { page: 'pages/income/ExpirationDate', query: {} }
      return  { page: 'pages/income/ArtScan', query: { errorMessage: 'Не удалось найти товар с данным ШК' } }
    }
  },
  {
    page: 'pages/income/ExpirationDate',
    to: function (params) {
      if (params.wps$direction === 'back') return { page: 'pages/income/ArtScan'}
      if (!params.dateexpire) return { page: 'pages/income/ExpirationDate', query: { errorMessage: 'Не выбран срок храненрия' } }
      if (!params.dateproduct) return { page: 'pages/income/ExpirationDate', query: { errorMessage: 'Не выбрана дата изготовдления' } }
      return { page: 'pages/income/PalletInfo', query: { message: 'Действие выполнено успешно' } }
    }
  },
  {
    page: 'pages/income/PalletInfo',
    to: function (params) {
      if (params.wps$direction === 'back') return { page: 'pages/income/ExpirationDate' }
      if (params.wps$direction === 'packagingProblem') return { page: 'pages/income/ArtScan' }
      if (params.wps$direction === 'next') return { page: 'pages/income/SiteScan' }
    }
  }
]

// Настройка задержки ответа сервера
const rnd = function (max) {
  return Math.floor((Math.random()*(max? max: 7000)) + 0)
}

// Переход к следующей странице
app.post('/move', function (request, response) {
  const  page = request.body.page
  const params = request.body.params
  if (!params.userId) {
    setTimeout(() => response.json({ errorMessage: 'Пользователь не авторизован' }), rnd())
    return
  }
  let nextDiretion
  for (let i=0; i<directions.length; i++) {
    const direction = directions[i]
    if (direction.page !== page) continue
    nextDiretion = direction.to(params)
    break
  }
  nextDiretion = nextDiretion? nextDiretion: directions[0]

  setTimeout(() => response.json(nextDiretion), rnd())
})

// Список унитов товара
app.use('/units', function (request, response) {
  const units = [
    { code: 'box', name: 'коробка' },
    { code: 'unit', name: 'штука'  },
    { code: 'block', name: 'блок'  }
  ]

  setTimeout(() => response.json(units), rnd())
})

// Аутентификация
app.post('/login', function (request, response) {
  const username = request.body.username
  const password = request.body.password
  const result = username === 'admin' && password === '111'? { fullName: 'Иванов И.И.', userId: 'ivanovii' }: { errorMessage: 'Неверный логин или пароль' }
  setTimeout(() => response.json(result), rnd())
})

app.use(function (request, response, next) {
  response.status(404).send({ errorMessage: 'Обращение к неизвестному сервису' })
})

app.listen(3000, function () {
  console.log('Демонстрационная страница: http://localhost:3000/page')
})
