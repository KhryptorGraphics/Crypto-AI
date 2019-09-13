const axios = require('axios');
var crypto = require('crypto')
var qs = require('qs')
var asynch = require('async')
var express = require('express');
const Poller = require('./Poller');
var router = express.Router();
var request = require('request')
var rp = require('request-promise')
var url = require('url')
const WebSocket = require('ws');
const { Client } = require('pg')

const client = new Client({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  database: 'postgres',
  password: 'ShockTube',
})


client.connect()

const binanceconfig = {
  API_KEY: '7TU23VLBxD97IkxeLlNeW0yxOkdPU21dr0SK8BdZcdVKZlFuXlSVbaS5OlPEE5cg',
  API_SECRET: '5keOL6cLaAVphppXXEsnwNY8aPeFNPBYFbpBDGbh3TJfPBm32b89Ycd0sROodPHv',
  HOST_URL: 'https://api.binance.com',
  useServerTime: true,
  recvWindow: 60000, 
}

const data = {
  symbol: 'XVGETH',
  recvWindow: 20000,
  timestamp: Date.now(),
};

const buildSign = function (data, binanceconfig) {
  const hmac = crypto.createHmac('sha256', binanceconfig.API_SECRET).update(data).digest('hex')
  console.log(hmac)
  return hmac
}


function createSymbolList(price, datalocation) {
  return new Promise((resolve, reject) => {
    let symbollist = [];
    price.forEach(element => {

      if (datalocation == 'exchange') {
      var symbolObject = {
        class_name: element.symbol
      }}

      if (datalocation == 'database') {
          var symbolObject = {
          class_name: element.class_name
        }
        symbolObject = JSON.stringify(symbolObject)
      }
      symbollist.push(symbolObject)
    });
    resolve(symbollist)
  })
}


function createPriceList(symbol_database, price_exchange) {
  return new Promise((resolve, reject) => {
    pricelist = []

    symbol_database.forEach(element => {

      const symbol = element.class_name;
      const id = element.id;

      const price_result = price_exchange.filter(price_element => price_element.symbol == symbol)
      
      if (price_result.length == 0) {
        console.log (symbol + 'has been delisted from the exchange')
      }
      else {
      var price = {
        symbol_id: id,
        symbol_price: price_result[0].price,
      }
      pricelist.push(price)
    }
    })
    resolve(pricelist)
  })
}


function calculateSymbolDiff(price_exchange, symbol_database) {
  return new Promise((resolve, reject) => {

    symbol_diff = price_exchange.filter(val =>
      !symbol_database.includes(JSON.stringify(val))
    )

    resolve(symbol_diff)
  })
}




async function updateSymbol() {
  try {
    const p1 = rp.get({ url: 'https://api.binance.com//api/v3/ticker/price' })
    const s1 = rp.get({ url: 'http://localhost:3000/api/symbol' })

    const price_exchange = await (p1);
    const sx1 = createSymbolList(JSON.parse(price_exchange), 'exchange')

    const symbol_database = await (s1);
    const sx2 = await createSymbolList(JSON.parse(symbol_database), 'database')

    const [symbollist_exchange, symbollist_database] = await Promise.all([sx1, sx2])


    const symbollist_diff = await calculateSymbolDiff(symbollist_exchange, symbollist_database);

    request.post({
      headers: { 'content-type': 'application/JSON' },
      url: 'http://localhost:3000/api/symbol', body: JSON.stringify(symbollist_diff)
    }, function (error, response, body) {
    })

  } catch (error) {
    console.log('Error', error)
  }
}





async function updateprice() {
  try {

    const symbol_database = await rp.get({ url: 'http://localhost:3000/api/symbol' })
    const p1 = rp.get({ url: 'https://api.binance.com//api/v3/ticker/price' })
    const p2 = rp.get({ url: 'http://localhost:3000/api/price' })
    const [price_exchange, price_database] = await Promise.all([p1, p2]);

    if (JSON.parse(symbol_database).length != 0) {
      if (JSON.parse(price_database).length == 0) {

        const pricelist = await createPriceList(JSON.parse(symbol_database), JSON.parse(price_exchange))

        rp.post({
          headers: { 'content-type': 'application/JSON' },
          url: 'http://localhost:3000/api/price', body: JSON.stringify(pricelist)
        }, function (error, response, body) {
        })
      }
    

      else {

        JSON.parse(symbol_database).forEach(element => {
          const symbol = element.class_name;
          const id = element.id;
          const price_id = JSON.parse(price_database).filter(element => element.symbol_id == id)
          const price_result = JSON.parse(price_exchange).filter(price_element => price_element.symbol == symbol)
          if (price_id.length != 0) {
            if (price_result.length == 0) {
              console.log(symbol + 'has been delisted from the exchange')
            }
            else {
              url = 'http://localhost:3000/api/price' + '/' + JSON.stringify(price_id[0].id)

              var price = {
                symbol_id: id,
                symbol_price: price_result[0].price,
              }
              request.put({
                headers: { 'content-type': 'application/JSON' },
                url: url, body: JSON.stringify(price)
              }, function (error, response, body) {

              })
            }
          }
        })
      }
    }

  } catch (error) {
    console.log('Error', error)
  }
}



async function createDataRange(symboldata, time) {

  try {


    var options = {
      method: 'POST',
      uri: 'http://localhost:3000/api/data_range',
      headers: { 'content-type': 'application/JSON' },
      body: JSON.stringify(time),
    }


    await rp(options)

  } catch (error) {
    console.log('Error', error)
  }

}
// Check if there is bug in push of object into the array similar to that one in react due to pass by reference.

async function updateDataRange(symboldata, datarange_database) {

  try {
    /*
    var options2 = {
      method: 'GET',
      uri: 'http://localhost:3000/api/data_1h/?symbol=ETHUSDT&class=ddd',
      headers: { 'content-type': 'application/JSON' }
    }


    const c2 = await rp(options2);
    console.log('data_check', JSON.parse(c2))
    
    */

    symbol = await symboldata.class_name
    var datarange_database_symbol = JSON.parse(datarange_database).filter(element => element.class_name == symbol)

    //check for the delisted symbols, or else they might give error since our database does not delete the delisted symbols

    let time_object = {
      begin_time: null,
      starttime: null,
      time_decimal: null,
    }

    if (datarange_database_symbol.length == 0) {

      let time = [{
        symbol_id: symboldata.id,
        class_name: symboldata.class_name,
        time_start: new Date(2018, 1, 30),
        time_end: new Date(2018, 1, 30),
      }]

      createDataRange(symboldata, time)


      time_object.begin_time = time[0].time_start
      time_object.starttime = time[0].time_end;
      time_object.time_decimal = new Date(time_object.starttime).getTime();

    }

    else {
      time_object.begin_time = (datarange_database_symbol[0]).time_start
      time_object.starttime = (datarange_database_symbol[0]).time_end;
      time_object.time_decimal = new Date((time_object.starttime)).getTime();
    }

    const begin_time = time_object.begin_time;
    const starttime = time_object.starttime;
    const time_decimal = time_object.time_decimal;


    tick_interval = '1h';
    //console.log(begin_time, starttime, time_decimal)
    url = 'https://api.binance.com/api/v1/klines?symbol=' + symboldata.class_name + '&interval=' + tick_interval + '&startTime=' + time_decimal

    const historicaldata = await rp.get(url)


    //console.log('historicaldata', JSON.parse(historicaldata))
    const historicaldata_length = JSON.parse(historicaldata).length


    if (historicaldata_length != 0) {

      data_all = []
      JSON.parse(historicaldata).forEach(item => {

        let crypto_data = {
          class_name: symboldata.class_name,
          symbol_id: symboldata.id,
          open_time: new Date(item[0]),
          close_time: new Date(item[6]),
          open_price: item[1],
          high_price: item[2],
          low_price: item[3],
          close_price: item[4],
          volume: item[5],
          Quote_asset_volume: item[7],
          no_of_trades: item[8],
          Taker_buy_base_asset_vol: item[9],
          taker_buy_quote_asset_volume: item[10]

        }
        data_all.push(crypto_data);
        console.log('data_all', data_all)

      })

      let data_historical_post = await data_all

      var options = {
        method: 'POST',
        uri: 'http://localhost:3000/api/data_1h',
        headers: { 'content-type': 'application/JSON' },
        body: JSON.stringify(data_historical_post),
      }


      //lets post 500 data at once. Currently total data = 13*500 

      const c1 = await rp(options);



      // const [x1, x2] = await Promise.all(historicaldata, c1)
      
      datarange_database = await rp.get({ url: 'http://localhost:3000/api/data_range' })


      const datarange_id = JSON.parse(datarange_database).filter(element => element.class_name == symboldata.class_name)

      console.log('id', datarange_id)

      url = 'http://localhost:3000/api/data_range/' + JSON.stringify(datarange_id[0].id);


      var time = {
        class_name: symboldata.class_name,
        symbol_id: symboldata.id,
        time_start: begin_time,
        time_end: new Date(JSON.parse(historicaldata)[historicaldata_length - 1][6]),
      }

      rp.put({
        headers: { 'content-type': 'application/JSON' },
        url: url, body: JSON.stringify(time)
      })

    }
  
}

  catch (error) {

    console.log('Error', error)
  }
}


async function asyncForEach(array, callback) {   //taken from https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}


function updatePriceAll(symbol_database, datarange_database) {

    if (JSON.parse(symbol_database).length != 0) {


      asyncForEach(JSON.parse(symbol_database), async(symboldata) => {
        await updateDataRange(symboldata, datarange_database)


      })


    }
}

async function historicalPriceStore() {
  
  try {

    const s1 = rp.get({ url: 'http://localhost:3000/api/symbol' })
    const d1 = rp.get({ url: 'http://localhost:3000/api/data_range' })

    const [symbol_database, datarange_database] = await Promise.all([s1, d1])

    await updatePriceAll(symbol_database, datarange_database)

  } catch (error) {
    console.log('Error', error)
  }
}



let poller = new Poller(10000);

poller.onPoll(() => {

  updateSymbol();
  updateprice();

  poller.poll();
});
poller.poll();


//first poll  
historicalPriceStore();
//first poll

let poller_historicalPrice = new Poller(600000);

poller_historicalPrice.onPoll(() => {


  poller_historicalPrice.poll();
});
poller_historicalPrice.poll();

//
//asynchronous calls







datastring = qs.stringify(data);
const signature = buildSign(datastring, binanceconfig);





  //test connectivity
/*
   url1 = 'https://api.binance.com/api/v3/myTrades' + '?' + datastring +'&signature=' + signature
   console.log(url1)
   request({method: 'GET', uri:url1, headers: {
    'X-MBX-APIKEY': binanceconfig.API_KEY,},}, function (error, response, body) {
    
    console.log(binanceconfig.API_KEY)
    console.log('error:', error); // Print the error if one occurred and handle it
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log(JSON.parse(body))
   });

*/
   const orderdata = {
    symbol: 'ETHBTC',
    side: 'BUY',
    type: 'LIMIT',
    timeInForce: 'GTC',
    quantity:	10,
    price: 0.01,
    recvWindow:	5000,
    timestamp: Date.now(),
  };

  const signature2 = buildSign(qs.stringify(orderdata), binanceconfig);
/*
  url1 = 'https://api.binance.com/api/v3/order' + '?' + qs.stringify(orderdata) +'&signature=' + signature2
  console.log(url1)
  request({method: 'POST', uri:url1, headers: {
   'X-MBX-APIKEY': binanceconfig.API_KEY,},}, function (error, response, body) {
   
   console.log(binanceconfig.API_KEY)
   console.log('error:', error); // Print the error if one occurred and handle it
   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
   console.log(JSON.parse(body))
  });
*/

const openOrderData = {
  timestamp: Date.now(),
};

  /*const signatureOpen = buildSign(qs.stringify(openOrderData), binanceconfig);
  url1 = 'https://api.binance.com/api/v3/openOrders' + '?' + qs.stringify(openOrderData) +'&signature=' + signatureOpen
  console.log(url1)
  request({method: 'GET', uri:url1, headers: {
   'X-MBX-APIKEY': binanceconfig.API_KEY,},}, function (error, response, body) {
   
   console.log(binanceconfig.API_KEY)
   console.log('error:', error); // Print the error if one occurred and handle it
   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
   console.log(JSON.parse(body))
  });

*/

const cancelOrderData = {
  symbol : 'ETHBTC',
  orderId: 478341657,
  timestamp: Date.now(),
};
const signatureCancel = buildSign(qs.stringify(cancelOrderData), binanceconfig)

/*url1 = 'https://api.binance.com/api/v3/order' + '?' + qs.stringify(cancelOrderData) +'&signature=' + signatureCancel
console.log(url1)
request({method: 'DELETE', uri:url1, headers: {
 'X-MBX-APIKEY': binanceconfig.API_KEY,},}, function (error, response, body) {
 
 console.log(binanceconfig.API_KEY)
 console.log('error:', error); // Print the error if one occurred and handle it
 console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
 console.log(JSON.parse(body))
});

*/
/*
const accountInformation = {
  timestamp: Date.now(),
};
const signatureAccount = buildSign(qs.stringify(accountInformation), binanceconfig) 
url1 = 'https://api.binance.com/api/v3/account' + '?' + qs.stringify(accountInformation) +'&signature=' + signatureAccount
console.log(url1)
request({method: 'GET', uri:url1, headers: {
 'X-MBX-APIKEY': binanceconfig.API_KEY,},}, function (error, response, body) {
 
 console.log(binanceconfig.API_KEY)
 console.log('error:', error); // Print the error if one occurred and handle it
 console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
 console.log(JSON.parse(body))
});
*/

async function accountInformation_nonzero (binanceconfig) {


  try {
    const accountInformation = {
        timestamp: Date.now(),
    };
    const signatureAccount = buildSign(qs.stringify(accountInformation), binanceconfig) 
    url_accountinfo = 'https://api.binance.com/api/v3/account' + '?' + qs.stringify(accountInformation) +'&signature=' + signatureAccount

     wallet = [];
    let account = await rp.get({ uri: url_accountinfo, headers: {
      'X-MBX-APIKEY': binanceconfig.API_KEY,}, json: true})
    
    
    return new Promise((resolve, reject) => {
    account.balances.forEach(element => {

      if (element.free != 0.0 || element.locked != 0.0 ) {
          wallet.push(element)
      }
    })
    resolve(wallet)
    })

  } catch (error) {
    console.log('Error', error)
  }
}


let symbola = "BTC";
let value = 0.01;

async function account_info(binanceconfig, symbol, value) {

  try {
  console.log('binanceconfig', binanceconfig)
  let check =   await accountInformation_nonzero(binanceconfig);
  //console.log('check', check)
  
  check.forEach(element => {
    console.log('element', symbol); 
    console.log('value', value);
    if (element.asset == symbol) {
       if (element.free > value) {
         console.log('sufficient fund to do this operation')
        throw new Error('sufficient fund to do this operation')

       }
       else {
         throw new Error('Insufficient fund to do this operation')
       }
    } else {
      throw new Error('Symbol not found')
    }
  })
}
 catch (error) {
  console.log('Error', error)
}
}



const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1h');

ws.on('message', function incoming(data) {
    console.log('data',data);
});


//account_info(binanceconfig, symbola, value);

router.get('/submit', function (req, res, next) {
  res.render('index')
});

router.post('/submit', function (req, res, next) {
  const user = req.body.title
  res.redirect('/users/submit')
})




// Click 
// Show funds 
// Field for user input for amount of funds 
// Tranging method , Leeching

// 1 hour period, Trade on only the currencies that are in green in % change in the last hour. 
// 10 % gain, out , 5% loss out 









module.exports = router;


/*
  request.post('https://api.binance.com//api/v1/ping', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred and handle it
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log(JSON.stringify(body))
    //console.log(JSON.parse(body).filters)
   // res.json({ "message": "yeah!" });
   });

   request.post('https://api.binance.com//api/v1/time', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred and handle it
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log( new Date (+JSON.parse(body).serverTime))
    //console.log(JSON.parse(body).filters)
   // res.json({ "message": "yeah!" });
   });
   */
