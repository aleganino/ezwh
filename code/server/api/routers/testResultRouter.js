'use strict'
const express = require('express')
const TestResultService = require('../services/testResultService')
const TestResultDao = require('../modules/testResultDao')
const { body, param, validationResult } = require('express-validator');
const service = new TestResultService(TestResultDao)
const router = express.Router()

router.get('/skuitems/:rfid/testResults',
    [
        param("rfid").isInt({gt:0})
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const data = await service.getSkuitemsRfidTestResults(req, res)
        if (data.ok) {
            return res.status(data.status).json(data.body)
        }
        return res.status(data.status).end()
    })

router.get('/skuitems/:rfid/testResults/:id',
    [
        param('rfid').isInt({gt:0}),
        param('id').isInt()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const data = await service.getSkuitemsRfidTestResultsId(req, res)
        if (data.ok) {
            return res.status(data.status).json(data.body)
        }
        return res.status(data.status).end()
    })

router.post('/skuitems/testResult/',
    [
        body('rfid').isInt({gt:0}),
        body('idTestDescriptor').isInt(),
        body('Date').isDate(),
        body('Result').isBoolean(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const data = await service.postSkuitemsTestResult(req, res)
        if (data.ok) {
            return res.status(data.status).json(data.body)
        }
        return res.status(data.status).end()
    })

router.put('/skuitems/:rfid/testResult/:id',
    [
        param('rfid').isInt({gt:0}),
        param('id').isInt(),
        body('newIdTestDescriptor').isInt(),
        body('newDate').isDate(),
        body('newResult').isBoolean(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const data = await service.putSkuitemsRfidTestResultId(req, res)
        if (data.ok) {
            return res.status(data.status).json(data.body)
        }
        return res.status(data.status).end()
    })

router.delete('/skuitems/:rfid/testResult/:id',
    [
        param('rfid').isInt({gt:0}),
        param('id').isInt()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const data = await service.deleteSkuitemsRfidTestResultId(req, res)
        if (data.ok) {
            return res.status(data.status).json(data.body)
        }
        return res.status(data.status).end()
    })

module.exports = router;