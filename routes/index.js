var express = require('express');
var router = express.Router();
const cryptoController = require('../controllers').symbol;
const priceController =  require('../controllers').currentprice;
const cryptodata_1h = require('../controllers').symbol_data_1h;
const datarange_controller  = require('../controllers').data_range;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/symbol', cryptoController.list);
router.post('/api/symbol', cryptoController.add);
router.get('/api/symbol/:id', cryptoController.getById)
router.put('/api/symbol/:id', cryptoController.update)
router.delete('/api/symbol/:id', cryptoController.delete)


router.get('/api/price', priceController.list);
router.post('/api/price', priceController.add);
router.get('/api/price/:id', priceController.getById)
router.put('/api/price/:id', priceController.update)
router.delete('/api/price/:id',priceController.delete)

router.get('/api/data_1h', cryptodata_1h.list);
router.post('/api/data_1h', cryptodata_1h.add);
router.get('/api/data_1h/:id', cryptodata_1h.getById)
router.put('/api/data_1h/:id', cryptodata_1h.update)
router.delete('/api/data_1h/:id',cryptodata_1h.delete)

router.get('/api/data_range', datarange_controller.list);
router.post('/api/data_range', datarange_controller.add);
router.get('/api/data_range/:id', datarange_controller.getById)
router.put('/api/data_range/:id', datarange_controller.update)
router.delete('/api/data_range/:id', datarange_controller.delete)




module.exports = router;
