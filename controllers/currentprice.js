const currentprice = require('../models').currentprice;
const symbol = require('../models').Symbol;

module.exports = {
    list(req, res) {
        return currentprice.findAll ({ 
            include: [{
                model: symbol
              }],
              
              order: [
                ['createdAt', 'DESC'],
                [{ model: symbol }, 'createdAt', 'DESC'],
              ],              

        })
        .then((currentprice) => res.status(200).send(currentprice))
        .catch((error) => {res.status(400).send(error);});
    },

    getById(req, res) {
        return currentprice.findById(req.params.id, {
            include: [{
                model: symbol
              }],
              
              order: [
                ['createdAt', 'DESC'],
                [{ model: symbol }, 'createdAt', 'DESC'],
              ],   
        })
        .then(currentprice => {
            if (!currentprice) {
                return re.status(404).send({
                    message: 'Price Not Found',
                });
            }
           
        return res.status(200).send(currentprice)
        })
        .catch((error) => {res.status(400).send(error);});
    },

    add(req, res) {
        
            const pricelist = (req.body)

            console.log('pricelist', pricelist)

            return currentprice.bulkCreate(
                pricelist,  { validate: true }, {returning: true})
            
                .then(() => {

                return currentprice.findAll() })
                .then (price => {
 
                res.status(201).send(price)})
                .catch((error) => { res.status(400).send(error); })
    },  


    update(req, res) {

        return currentprice.findById(req.params.id, {
                        include: [{
                model: symbol
              }],
              
              order: [
                ['createdAt', 'DESC'],
                [{ model: symbol }, 'createdAt', 'DESC'],
              ],   
        })
        .then(currentprice => {
            if (!currentprice) {
                return res.status(404).send({
                    message: 'Price Not found', 
                });
            }
        return currentprice
            .update({
                symbol_price: req.body.symbol_price,
                symbol_id : req.body.symbol_id,
            })
            .then(() => res.status(200).send(currentprice))
            .catch((error) => res.status(400).send(currentprice));
        
         });
    },



    delete(req, res) {
        return currentprice.findById(req.params.id)
        .then(currentprice => {
            if (!currentprice) {
                return res.status(404).send({
                    message: 'Price not found',
                });
            }
            return currentprice
            .destroy()
            .then(() => res.status(204).send())
            .catch((error) => res.status(400).send(error)); 
        })
        .catch((error) => res.status(400).send(error));
    },
};


