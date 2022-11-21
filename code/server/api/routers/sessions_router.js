'use strict'
const express = require('express')
const UserService = require('../services/user_service')
const UserDao = require('../modules/user_dao')

const service = new UserService(UserDao)
const router = express.Router()

router.post('/customerSessions', async (req, res) => {
   if (!req.body.username) {
      res.status(400).end()
   }
   if (!req.body.password) {
      res.status(400).end()
   }

   //check if username is email
   var validator = require('node-email-validation')

   const isValidEmail = validator.is_email_valid(req.body.username) // true

   if (!isValidEmail) {
      return res.status(400).send('username must be an Email')
   }

   try {
      const user = await service.getCustomerSessions(req.body.username)


      if (user.length === 0) {
         return res.status(400).end()
      }
      const loginuser = [user[0].username, user[0].name, user[0].id]

      if (user[0].password !== req.body.password) {

         return res.status(401).send('wrong username and/or password')
      }

      return res.status(200).json(loginuser)
   } catch (err) {

      return res.status(500).end()
   }
})

router.post('/clerkSessions', async (req, res) => {
   if (!req.body.username) {
      res.status(400).end()
   }
   if (!req.body.password) {
      res.status(400).end()
   }

   //check if username is email
   var validator = require('node-email-validation')

   const isValidEmail = validator.is_email_valid(req.body.username) // true

   if (!isValidEmail) {
      return res.status(400).send('username must be an Email')
   }

   try {
      const user = await service.getClerkSessions(req.body.username)

      const loginuser = [user[0].username, user[0].name, user[0].id]
      if (user.length === 0) {
         return res.status(400).end()
      }

      if (user[0].password !== req.body.password) {
         return res.status(401).send('wrong username and/or password')
      }

      return res.status(200).json(loginuser)
   } catch (err) {

      return res.status(500).end()
   }
})

router.post('/supplierSessions', async (req, res) => {
   if (!req.body.username) {
      res.status(400).end()
   }
   if (!req.body.password) {
      res.status(400).end()
   }

   //check if username is email
   var validator = require('node-email-validation')

   const isValidEmail = validator.is_email_valid(req.body.username) // true

   if (!isValidEmail) {
      return res.status(400).send('username must be an Email')
   }

   try {
      const user = await service.getSupplierSessions(req.body.username)

      const loginuser = [user[0].username, user[0].name, user[0].id]
      if (user.length === 0) {
         return res.status(400).end()
      }

      if (user[0].password !== req.body.password) {
         return res.status(401).send('wrong username and/or password')
      }

      return res.status(200).json(loginuser)
   } catch (err) {

      return res.status(500).end()
   }
})

router.post('/qualityEmployeeSessions', async (req, res) => {
   if (!req.body.username) {
      res.status(400).end()
   }
   if (!req.body.password) {
      res.status(400).end()
   }

   //check if username is email
   var validator = require('node-email-validation')

   const isValidEmail = validator.is_email_valid(req.body.username) // true

   if (!isValidEmail) {
      return res.status(400).send('username must be an Email')
   }

   try {
      const user = await service.getQualityEmployeeSessions(req.body.username)

      const loginuser = [user[0].username, user[0].name, user[0].id]
      if (user.length === 0) {
         return res.status(400).end()
      }

      if (user[0].password !== req.body.password) {
         return res.status(401).send('wrong username and/or password')
      }

      return res.status(200).json(loginuser)
   } catch (err) {

      return res.status(500).end()
   }
})

router.post('/deliveryEmployeeSessions', async (req, res) => {
   if (!req.body.username) {
      res.status(400).end()
   }
   if (!req.body.password) {
      res.status(400).end()
   }

   //check if username is email
   var validator = require('node-email-validation')

   const isValidEmail = validator.is_email_valid(req.body.username) // true

   if (!isValidEmail) {
      return res.status(400).send('username must be an Email')
   }

   try {
      const user = await service.getDeliveryEmployeeSessions(req.body.username)

      const loginuser = [user[0].username, user[0].name, user[0].id]
      if (user.length === 0) {
         return res.status(400).end()
      }

      if (user[0].password !== req.body.password) {
         return res.status(401).send('wrong username and/or password')
      }

      return res.status(200).json(loginuser)
   } catch (err) {

      return res.status(500).end()
   }
})

router.post('/managerSessions', async (req, res) => {
   if (!req.body.username) {
      res.status(400).end()
   }
   if (!req.body.password) {
      res.status(400).end()
   }

   //check if username is email
   var validator = require('node-email-validation')

   const isValidEmail = validator.is_email_valid(req.body.username) // true

   if (!isValidEmail) {
      return res.status(400).send('username must be an Email')
   }

   try {
      const user = await service.getmanagerSessions(req.body.username)


      const loginuser = [user[0].username, user[0].name, user[0].id]
      if (user.length === 0) {
         return res.status(400).end()
      }

      if (user[0].password !== req.body.password) {
         return res.status(401).send('wrong username and/or password')
      }

      return res.status(200).json(loginuser)
   } catch (err) {

      return res.status(500).end()
   }
})

module.exports = router
