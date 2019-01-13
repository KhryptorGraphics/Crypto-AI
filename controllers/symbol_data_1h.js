const symbol_data_1h = require('../models').Symbol_data_1h;
const symbol = require('../models').Symbol;
const data_range = require('../models').data_range;
var url = require('url')

module.exports = {



    list(req, res) {
        let params = { crypto_symbol: 'ETHBTC',        
        time_start: new Date(2018, 5, 26),
        time_end: new Date(2018, 7, 30)
        };

        console.log('body', req.body.symbol, req.body.time_start, req.body.time_end, req.body, req.body.time_start == undefined, req.body.symbol!=undefined)

        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        if (query.symbol != undefined) {
            params.crypto_symbol = query.symbol;
        }

        /// Bug while quering historical data. The data range of the data  does not match with the range given as input
        data_range.sequelize.query('SELECT * FROM "data_ranges" WHERE class_name=:symbol', {
            replacements:{symbol:params.crypto_symbol}, type: data_range.sequelize.QueryTypes.SELECT
        })
        .then((data_range_data) => {
            params.time_start = data_range_data[0].time_start;
            params.time_end = data_range_data[0].time_end ;
            
        })
        .then (() => {
            console.log('timecontroller2', params.symbol, params.time_start, params.time_end)

            symbol_data_1h.sequelize.query('SELECT * FROM "Symbol_data_1hs" WHERE class_name=:symbol AND open_time>=:open_time AND close_time<=:close_time ORDER BY open_time ASC',{
                replacements: {symbol:params.crypto_symbol, open_time:params.time_start, close_time:params.time_end}, type: symbol_data_1h.sequelize.QueryTypes.SELECT
            })
            .then((data_1h) => res.status(200).send(data_1h) )
            .catch((error) => {res.status(400).send(error);});
        })

        .catch((error) => {res.status(400).send(error);});


},

    getById(req, res) {
        return symbol_data_1h.findById(req.params.id, {
            include: [{
                model: symbol
              }],
              
              order: [
                ['createdAt', 'DESC'],
                [{ model: symbol }, 'createdAt', 'DESC'],
              ],   
        })
        .then(symbol_data_1h => {
            if (!symbol_data_1h) {
                return re.status(404).send({
                    message: 'Price Not Found',
                });
            }
           
        return res.status(200).send(symbol_data_1h)
        })
        .catch((error) => {res.status(400).send(error);});
    },

    add(req, res) {
        
        const symbol_data = (req.body)

            return symbol_data_1h.bulkCreate(
                symbol_data,{ validate: true }, {returning: true})
            
                .then(() => {
                res.status(201).send()})
                .catch((error) => { res.status(400).send(error); })
    },     


    update(req, res) {
        return symbol_data_1h.findById(req.params.id, {
                        include: [{
                model: symbol
              }],
              
  
        })
        .then(symbol_data_1h => {
            if (!symbol_data_1h) {
                return res.status(404).send({
                    message: 'Price Not found', 
                });
            }
        return symbol_data_1h
            .update({
                symbol_price: req.body.symbol_price,
                symbol_id : req.body.symbol_id,
            })
            .then(() => res.status(200).send(symbol_data_1h))
            .catch((error) => res.status(400).send(symbol_data_1h));
        
         });
    },



    delete(req, res) {
        return symbol_data_1h.findById(req.params.id)
        .then(symbol_data_1h => {
            if (!symbol_data_1h) {
                return res.status(404).send({
                    message: 'Price not found',
                });
            }
            return symbol_data_1h
            .destroy()
            .then(() => res.status(204).send())
            .catch((error) => res.status(400).send(error)); 
        })
        .catch((error) => res.status(400).send(error));
    },
};


