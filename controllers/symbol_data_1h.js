const symbol_data_1h = require('../models').Symbol_data_1h;
const symbol = require('../models').Symbol;

module.exports = {
    list(req, res) {
        return symbol_data_1h.findAll ({ 
            include: [{
                model: symbol
              }],          

        })
        .then((symbol_data_1h) => res.status(200).send(symbol_data_1h))
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


