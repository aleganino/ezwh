'use strict'
const express = require('express');
const SkuService = require('../services/sku_service')
const SkuDao = require('../modules/skuDao')

const service = new SkuService(SkuDao)
const router = express.Router()
const { body, param, validationResult } = require('express-validator');


   router.get('/skus', async (req, res) => {
      const data = await service.getSKUs()
      if(data.ok) {
         return res.status(data.status).json(data.body)
      }
      return res.status(data.status).end()
   })

   router.get('/skus/:id',
      [param('id').isNumeric(),
      ], async (req, res) => {
      const id = req.params.id

      //validation
      const errors=validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
      }

      const data = await service.getSKUsById(id)
      if(data.ok) {
         return res.status(data.status).json(data.body)
      }
      return res.status(data.status).end()
   })

   router.post('/sku',
      [body('weight').isInt({min:0}).exists(),
      body('volume').isInt({min:0}).exists(),
      body('price').isFloat({min:0}).exists(),
      body('availableQuantity').isInt({min:0}),
      body('description').isString().isLength({min:1}),
      body('notes').isString().isLength({min:1}),
      ], async (req, res) => {
      const sku = req.body

      //validation
      const errors=validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
      }
      //connection to database function
      const data = await service.createSku(sku.description,sku.weight,sku.volume,sku.notes,sku.price,sku.availableQuantity,sku.positionID)
      if(data.ok) {
         return res.status(data.status).end()
      }
      return res.status(data.status).end()
   })

   router.put('/sku/:id',
      [param('id').isNumeric(),
      body('newWeight').isFloat({min:0}),
      body('newVolume').isFloat({min:0}),
      body('newPrice').isFloat({min:0}),
      body('newAvailableQuantity').isInt({min:0}),
      body('newDescription').isString(),
      ], async (req, res) => {
      const sku = req.body
      const id = req.params.id
      let status = 503
      //validation
      const errors=validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
      }

      //connection to database function
      const data=await service.editSku(
         id,
         sku.newDescription,
         sku.newWeight,
         sku.newVolume,
         sku.newNotes,
         sku.newPrice,
         sku.newAvailableQuantity
      )
      if(data.ok) {
         return res.status(data.status).end()
      }
      return res.status(data.status).end()
   })

   router.put('/sku/:id/position',
      [param('id').isNumeric({min:0}),
      body('positionID').isNumeric({min:0}),
      ], async (req, res) => {
      const positionID = req.body.position
      const id = req.params.id
      //validation
      const errors=validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
      }

      //connection to database function
      const data=await service.editSkuPosition(id, positionID)
      if(data.ok) {
         return res.status(data.status).end()
      }
      return res.status(data.status).end()
   })

   router.delete('/skus/:id',
      [param('id').isNumeric(),
      ], async (req, res) => {
      const id = req.params.id
      //validation
      const errors=validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
      }
      //connection to database function
      const data=await service.deleteSku(id)
      if(data.ok) {
         return res.status(data.status).end()
      }
      return res.status(data.status).end()
   })

   module.exports = router;