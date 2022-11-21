'use strict'
const express = require('express')
const TestDescriptorService = require('../services/testDescriptorService')
const TestDescriptorDao = require('../modules/testDescriptorDao')
const { body, param, validationResult } = require('express-validator');
const service = new TestDescriptorService(TestDescriptorDao)
const router = express.Router()

router.get('/testDescriptors',
   async (req, res) => {
      const data = await service.getTestDescriptors(req, res)
      if (data.ok) {
         return res.status(data.status).json(data.body)
      }
      return res.status(data.status).end()
   })

router.get('/testDescriptors/:id',
   [
      param('id').isInt()
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(422).json({ errors: errors.array() });
      }
      const data = await service.getTestDescriptorsId(req, res)
      if (data.ok) {
         return res.status(data.status).json(data.body)
      }
      return res.status(data.status).end()
   })

router.post('/testDescriptor/',
   [
      body('name').isString(),
      body('procedureDescription').isString(),
      body('idSKU').isInt()
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(422).json({ errors: errors.array() });
      }
      const data = await service.postTestDescriptor(req, res)
      if (data.ok) {
         return res.status(data.status).end()
      }
      return res.status(data.status).end()
   })

router.put('/testDescriptor/:id',
   [
      param('id').isInt(),
      body('newName').isString(),
      body('newProcedureDescription').isString(),
      body('newIdSKU').isInt()
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(422).json({ errors: errors.array() });
      }
      const data = await service.putTestDescriptorId(req, res)
      if (data.ok) {
         return res.status(data.status).end()
      }
      return res.status(data.status).end()
   })


router.delete('/testDescriptor/:id',
   [
      param('id').isInt()
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(422).json({ errors: errors.array() });
      }
      const data = await service.deleteTestDescriptorId(req, res)
      if (data.ok) {
         return res.status(data.status).end()
      }
      return res.status(data.status).end()
   })

module.exports = router;