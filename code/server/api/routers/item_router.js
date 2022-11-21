'use strict'
const express = require('express')
const ItemService = require('../services/item_service')
const ItemDao = require('../modules/item_dao')

const service = new ItemService(ItemDao)
const router = express.Router()

router.get('/items', async (req, res) => {
   const data = await service.getItems()
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.get('/items/:id/:supplierID', async (req, res) => {
   const data = await service.getItem(req.params.id, req.params.supplierID)
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.post('/item', async (req, res) => {
   const data = await service.createItem(req.body)
   if (data.ok) {
      return res.status(data.status).end()
   }
   return res.status(data.status).end()
})

router.put('/item/:id/:supplierID', async (req, res) => {
   const data = await service.updateItem(req.params.id, req.body, req.params.supplierID)
   if (data.ok) {
      return res.status(data.status).end()
   }
   return res.status(data.status).end()
})

router.delete('/items/:id/:supplierID', async (req, res) => {
   const data = await service.deleteItem(req.params.id, req.params.supplierID)
   if (data.ok) {
      return res.status(data.status).end()
   }
   return res.status(data.status).end()
})

module.exports = router
