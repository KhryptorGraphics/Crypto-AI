const data_range = require('../models').data_range;
const symbol = require('../models').Symbol;

module.exports = {
    
    list(req, res) {
        return data_range.findAll ({ 
            include: [{
                model: symbol
              }],
              
              order: [
                ['createdAt', 'DESC'],
                [{ model: symbol }, 'createdAt', 'DESC'],
              ],              

        })
        .then((data_range) => res.status(200).send(data_range))
        .catch((error) => {res.status(400).send(error);});
    },

    getById(req, res) {
        return data_range.findById(req.params.id)
        .then(data_range => {
            if (!data_range) {
                return re.status(404).send({
                    message: 'data_range Not Found',
                });
            }
           
        return res.status(200).send(data_range)
        })
        .catch((error) => {res.status(400).send(error);});
    },

    add(req, res) {
        
        const data_range_list = (req.body)

            return data_range.bulkCreate(
                data_range_list,  { validate: true }, {returning: true})
            
                .then(() => {

                return data_range.findAll() })
                .then (data => {
 
                res.status(201).send(data)})
                .catch((error) => { res.status(400).send(error); })
    },      

    

    update(req, res) {
        return data_range.findById(req.params.id)
        .then(data_range => {
            if (!data_range) {
                return res.status(404).send({
                    message: 'data_range not found', 
                });
            }
        return data_range
            .update({
                time_start: req.body.time_start,
                time_end: req.body.time_end,
            })
            .then(() => res.status(200).send(data_range))
            .catch((error) => res.status(400).send(error));
        
         });
    },



    delete(req, res) {
        return data_range.findById(req.params.id)
        .then(data_range => {
            if (!data_range) {
                return resizeBy.status(400).send({
                    message: 'data_range not found',
                });
            }
            return data_range
            .destroy()
            .then(() => res.status(204).send())
            .catch((error) => res.status(400).send(error)); 
        })
        .catch((error) => res.status(400).send(error));
    },
};