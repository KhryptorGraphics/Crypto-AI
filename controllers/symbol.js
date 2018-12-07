const symbol = require('../models').Symbol;

module.exports = {
    list (req, res) {
        return symbol.findAll()
            .then(symbol => res.status(200).send(symbol))
            .catch((error) => {res.status(400).send(error);});
    },

    getById(req, res) {
        return symbol.findById(req.params.id)
        .then(symbol => {
            if (!symbol) {
                return re.status(404).send({
                    message: 'Symbol Not Found',
                });
            }
           
        return res.status(200).send(symbol)
        })
        .catch((error) => {res.status(400).send(error);});
    },


        add(req, res) {
        
        const symbollist = (req.body)
        console.log(symbollist)

            return symbol.bulkCreate(
                symbollist,  { validate: true }, {returning: true})
            
                .then(() => {

                return symbol.findAll() })
                .then (symbol => {
 
                res.status(201).send(symbol)})
                .catch((error) => { res.status(400).send(error); })
    },      


    update(req, res) {

        return symbol.findById(req.params.id)
        .then(symbol => {
            if (!symbol) {
                return res.status(404).send({
                    message: 'Symbol not found', 
                });
            }
        return symbol
            .update({
                class_name: req.body.class_name
            })
            .then(() => res.status(200).send(symbol))
            .catch((error) => res.status(400).send(error));
        
         });
    },



    delete(req, res) {
        return symbol.findById(req.params.id)
        .then(symbol => {
            if (!symbol) {
                return resizeBy.status(400).send({
                    message: 'Symbol not found',
                });
            }
            return symbol
            .destroy()
            .then(() => res.status(204).send())
            .catch((error) => res.status(400).send(error)); 
        })
        .catch((error) => res.status(400).send(error));
    },
};