'use strict'
const express = require('express')
const UserService = require('../services/user_service')
const UserDao = require('../modules/user_dao')

const service = new UserService(UserDao)
const router = express.Router()
const { body, param, validationResult } = require('express-validator');

//GET
//to be implemented due to login/logout functionality not implemented
router.get('/userinfo', async (req, res) => {
   return res.status(401).end()
})

router.get('/suppliers', async (req, res) => {
   const data = await service.getSuppliers()
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.get('/users', async (req, res) => {
   const data = await service.getUsers()
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

//POST
router.post('/newUser', async (req, res) => {
   const data = await service.createUser(req.body)
   if (data.ok) {
      return res.status(data.status).end()
   }
   return res.status(data.status).end()
})

router.post('/managerSessions', async (req, res) => {
   const data = await service.session('manager', req.body)
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.post('/customerSessions', async (req, res) => {
   const data = await service.session('customer', req.body)
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.post('/supplierSessions', async (req, res) => {
   const data = await service.session('supplier', req.body)
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.post('/clerkSessions', async (req, res) => {
   const data = await service.session('clerk', req.body)
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.post('/qualityEmployeeSessions', async (req, res) => {
   const data = await service.session('qualityEmployee', req.body)
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

router.post('/deliveryEmployeeSessions', async (req, res) => {
   const data = await service.session('deliveryEmployee', req.body)
   if (data.ok) {
      return res.status(data.status).json(data.body)
   }
   return res.status(data.status).end()
})

//to be implemented due to login/logout functionality not implemented
router.post('/logout', async (req, res) => {
   return res.status(200).end()
})

//PUT
router.put('/users/:username', async (req, res) => {
   const data = await service.updateUser(req.params.username, req.body)
   if (data.ok) {
      return res.status(data.status).end()
   }
   return res.status(data.status).end()
})

//DELETE
router.delete('/users/:username/:type', [
   param('username').isEmail(),
   param("type").isIn(["customer", "supplier", "qualityEmployee", "clerk", "deliveryEmployee"])
], async (req, res) => {

   const errors=validationResult(req);
   if (!errors.isEmpty()) {
       return res.status(422).end();
   }

   const data = await service.deleteUser(req.params.username, req.params.type)
   if (data.ok) {
      return res.status(data.status).end()
   }
   return res.status(data.status).end()
})


module.exports = router
