'use strict'
const express = require('express')
const ReturnOrderService = require('../services/returnOrder_service')
const ReturnOrderDao = require('../modules/returnOrder_dao')

const service = new ReturnOrderService(ReturnOrderDao)
const router = express.Router()
const { body, param, validationResult } = require('express-validator')

router.get('/returnOrders', async (req, res) => {
   const data = await service.getReturnOrders()
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.get('/returnOrders/:id', async (req, res) => {
   const data = await service.getReturnOrder(req.params.id)
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.post('/returnOrder', [
   body('returnDate').isString().exists(),
   body('restockOrderId').isInt().exists(),
],async (req, res) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(422).end()
   }

   const data = await service.createReturnOrder(req.body)
   if (data.ok) {
      return res.status(data.status).end()
   }
   return res.status(data.status).end()
})

router.delete('/returnOrder/:id', async (req, res) => {
   const data = await service.deleteReturnOrder(req.params.id)
   if (data.ok) {
      return res.status(data.status).end()
   }
   return res.status(data.status).end()
})

module.exports = router
