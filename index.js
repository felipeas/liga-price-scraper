const { send } = require('micro')
const { router, get } = require('microrouter')
const cors = require('micro-cors')()
const osmosis = require('osmosis')
const LIGA_ADDR = 'https://www.ligamagic.com.br/?view=cards/card&card='

const notfound = (req, res) =>
  send(res, 404, 'not the droids you are looking for')

//TODO: reject promise with custom message
const makeOsmosisPromise = res => url => find => set => {
  return new Promise((resolve, reject) => {
    osmosis
      .get(url)
      .find(find)
      .set(set)
      .data(result => {
        resolve(result)
      })
      .log(console.log)
      .error(() => reject(send(res, 418, 'card not found')))
      .debug(console.log)
  })
}

const ligaUrl = card => {
  return `${LIGA_ADDR}${card}`
}

const pricerBasic = (req, res) => {
  const params = req.url.match(/^\/(\w+)\/(.+)$/)
  if (params) {
    const [route, card] = params.splice(1)

    const data = {
      Low: '#omoMenorPreco',
      Avg: '#omoMedioPreco',
      High: '#omoMaiorPreco',
    }

    const find = '.precos'

    return makeOsmosisPromise(res)(ligaUrl(card))(find)(data)
  }
}

const pricerFull = (req, res) => {
  const params = req.url.match(/^\/(\w+)\/(.+)$/)
  if (params) {
    const [route, card] = params.splice(1)

    const data = {
      Low: '#omoMenorPreco',
      Avg: '#omoMedioPreco',
      High: '#omoMaiorPreco',
    }

    const find = '.precos'

    return makeOsmosisPromise(res)(ligaUrl(card))(find)(data)
  }
}

const test = (req, res) => {
  return makeOsmosisPromise('www.google.com')('head')({
    abc: 'title',
  })
}

const api = router(
  get('/test', test),
  get('/card/:name', pricerBasic),
  get('/card/:name/full', pricerFull),
  get('/*', notfound),
)

module.exports = cors(api)
