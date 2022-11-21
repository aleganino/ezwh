'use strict'
const express = require('express');
const SkuItemService = require('../services/sku_item_service')
const SkuItemDao = require('../modules/skuItemDao')

const service = new SkuItemService(SkuItemDao)
const router = express.Router()
const { body, param, validationResult } = require('express-validator');



   router.get('/skuitems', async (req, res) => {
      //connection to database function
      const data=await service.getSkuItems()
      if(data.ok) {
         return res.status(data.status).json(data.body)
      }
      return res.status(data.status).end()
   })

   router.get('/skuitems/sku/:id',
      [param('id').isNumeric(),
      ], async (req, res) => {
      const id = req.params.id;
      //validation
      const errors=validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(422).json({ errors: errors.array() });
      }  
      //connection to database function
      const data=await service.getSKUItemsById(id)
      if(data.ok) {
         return res.status(data.status).json(data.body)
      }
      return res.status(data.status).end()
   })

   router.get('/skuitems/:rfid',
      [param('rfid').isNumeric()
      ], async (req, res) => {
      const rfid = req.params.rfid
      //validation
      const errors=validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(422).json({ errors: errors.array() });
      }
      //connection to database function
      const data=await service.getSKUItemsByRfid(rfid)
      if(data.ok) {
      return res.status(data.status).json(data.body)
      }
      return res.status(data.status).end()
   })

   router.post('/skuitem',
      [body('RFID').isNumeric(),
      body('SKUId').isNumeric(),
      //body('DateOfStock').isISO8601(),
      ], async (req, res) => {
      const skuitem = req.body

      //validation
      const errors=validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(422).json({ errors: errors.array() });
      }

      //connection to database function
      const data=await service.createSkuItem(skuitem.RFID, skuitem.SKUId, skuitem.DateOfStock)
      if(data.ok) {
      return res.status(data.status).json(data.body)
      }
      return res.status(data.status).end()
   })

   router.put('/skuitems/:rfid',
      [param('rfid').isNumeric(),
      body('newRFID').isNumeric(),
      body('newAvailable').isBoolean(),
      //body('DateOfStock').isISO8601(),
      ], async (req, res) => {
      const skuitem = req.body
      const rfid = req.params.rfid
      //validation
      const errors=validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(422).json({ errors: errors.array() });
      }
      //connection to database function
     const data=await service.editSkuItem(
         rfid,
         skuitem.newRFID,
         skuitem.newAvailable,
         skuitem.newDateOfStock
      )
      if(data.ok) {
      return res.status(data.status).json(data.body)
      }
      return res.status(data.status).end()
   })

   router.delete('/skuitems/:rfid',[
      param('rfid').isNumeric(),
      ], async (req, res) => {
      const rfid = req.params.rfid
      //validation
      const errors=validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(422).json({ errors: errors.array() });
      }
      //connection to database function
     const data=await service.deleteSkuItem(rfid)
     if(data.ok) {
      return res.status(data.status).json(data.body)
      }
      return res.status(data.status).end()
   })


module.exports=router