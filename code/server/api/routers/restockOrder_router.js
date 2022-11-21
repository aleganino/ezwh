 'use strict'
const express = require('express')
const RestockOrderService = require('../services/restockOrder_service')
const RestockOrderDao = require('../modules/restockOrder_dao')

const service = new RestockOrderService(RestockOrderDao)
const router = express.Router()
const { body, param, validationResult } = require('express-validator')

router.get('/restockOrders', async (req, res) => {
   const data = await service.getRestockOrders()
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.get('/restockOrdersIssued', async (req, res) => {
   const data = await service.getRestockOrders('ISSUED')
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.get('/restockOrders/:id', async (req, res) => {
   const data = await service.getRestockOrder(req.params.id)
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.get('/restockOrders/:id/returnItems', async (req, res) => {
   const data = await service.getReturnItems(req.params.id)
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.post('/restockOrder',
   [body('issueDate').isString().exists(), body('supplierId').isInt().exists()],
   async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(422).end()
      }

      const data = await service.createRestockOrder(req.body)
      if (data.ok) {
         return res.status(data.status).end()
      }
      return res.status(data.status).end()
   }
)

router.put('/restockOrder/:id', async (req, res) => {
   const data = await service.setRestockOrderState(req.params.id, req.body)
   if (data.ok) {
      return res.status(data.status).end()
   }
   return res.status(data.status).end()
})

router.put('/restockOrder/:id/skuItems',
   [body('skuItems').isArray().exists()],
   async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(422).end()
      }

      const data = await service.addSkuItems(req.params.id, req.body)
      if (data.ok) {
         return res.status(data.status).end()
      }
      return res.status(data.status).end()
   }
)

router.put('/restockOrder/:id/transportNote', async (req, res) => {
   const data = await service.addTransportNote(req.params.id, req.body)
   if (data.ok) {
      return res.status(data.status).end()
   }
   return res.status(data.status).end()
})

router.delete('/restockOrder/:id',
   [param('id').isNumeric()],
   async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(422).end()
      }

      const data = await service.deleteRestockOrder(req.params.id)
      if (data.ok) {
         return res.status(data.status).end()
      }
      return res.status(data.status).end()
   }
)

module.exports = router
