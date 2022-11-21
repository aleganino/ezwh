'use strict'
const express = require('express')
const InternalOrderService = require('../services/internalOrder_service')
const InternalOrderDao = require('../modules/internalOrder_dao')

const service = new InternalOrderService(InternalOrderDao)
const router = express.Router()

router.get('/internalOrders', async (req, res) => {
   const data = await service.getInternalOrders()
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.get('/internalOrders/:id', async (req, res) => {
   const data = await service.getInternalOrder(req.params.id)
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.get('/internalOrdersIssued', async (req, res) => {
   const data = await service.getInternalOrders('ISSUED')
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.get('/internalOrdersAccepted', async (req, res) => {
   const data = await service.getInternalOrders('ACCEPTED')
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.post('/internalOrders', async (req, res) => {
   const data = await service.createInternalOrder(req.body)
   if (data.ok) {
      return res.status(data.status).end()
   }
   return res.status(data.status).end()
})

router.put('/internalOrders/:id', async (req, res) => {
   const data = await service.setInternalOrderState(req.params.id, req.body)
   if (data.ok) {
      return res.status(data.status).end()
   }
   return res.status(data.status).end()
})

router.delete('/internalOrders/:id', async (req, res) => {
   const data = await service.deleteInternalOrder(req.params.id)
   if (data.ok) {
      return res.status(data.status).end()
   }
   return res.status(data.status).end()
})

module.exports = router
