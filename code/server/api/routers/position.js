'use strict'
const express = require('express');
const PositionService = require('../services/position_service')
const PositionDao = require('../modules/positionDao')

const service = new PositionService(PositionDao)
const router = express.Router()
const { body, param, validationResult } = require('express-validator');


    router.get('/positions', async (req, res) => {
        //connection to database function
        const data= await service.getPositions()
        if(data.ok) {
            return res.status(data.status).json(data.body)
         }
        return res.status(data.status).end()
    })

    router.post('/position',
        [body('positionID').isLength(12).isNumeric(),
        body('aisleID').isLength(4),
        body('row').isLength(4),
        body('col').isLength(4),
        body('maxWeight').isFloat({min: 0}),
        body('maxVolume').isFloat({min: 0}),
        ], async (req, res) => {
        const position = req.body
        //validation
        const errors=validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }  
        //connection to database function
        const data= await service.createPosition(position.positionID, position.aisleID, position.row, position.col, position.maxVolume, position.maxWeight)
        if(data.ok) {
            return res.status(data.status).json(data.body)
        }
        return res.status(data.status).end()
    })

    router.put('/position/:positionID',
        [param('positionID').isLength(12).isNumeric(),
        body('newAisleID').isLength(4),
        body('newRow').isLength(4),
        body('newCol').isLength(4),
        body('newMaxWeight').isFloat({min: 0}),
        body('newMaxVolume').isFloat({min: 0}),
        //couldn't find a specific method so I implemented one to check the constraints.
        body('newOccupiedVolume').isFloat({min: 0}).custom((value,{req, loc, path})=>{
            if(value>req.body.newMaxVolume)
                throw new Error("Volume exceeds the limit.")
            else   
                return value;
        }),
        body('newOccupiedWeight').isFloat({min: 0}).custom((value,{req, loc, path})=>{
            if(value>req.body.newMaxWeight)
                throw new Error("Weight exceeds the limit.")
            else   
                return value;
        }),
        ], async (req, res) => {
        const positionID=req.params.positionID;
        const position = req.body
        //validation
        const errors=validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } 
        //connection to database function
        const data= await service.editPosition(positionID, position.newAisleID, position.newRow, position.newCol, position.newMaxVolume, position.newMaxWeight, position.newOccupiedVolume, position.newOccupiedWeight)
        if(data.ok) {
            return res.status(data.status).json(data.body)
        }
        return res.status(data.status).end()
    })

    router.put('/position/:positionID/changeID',
        [param('positionID').isLength(12).isNumeric(),
        body('newPositionID').isLength(12).isNumeric(),
        ], async (req, res) => {
        const oldPositionID=req.params.positionID;
        const newPositionID = req.body.newPositionID;
        //validation
        const errors=validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } 
        //connection to database function
        const data= await service.editPositionID(newPositionID, oldPositionID)
        if(data.ok) {
            return res.status(data.status).json(data.body)
        }
        return res.status(data.status).end()
    })

    router.delete('/position/:positionID',
        [param('positionID').isLength(12).isNumeric(),
        ] , async (req, res) => {
        const positionID = req.params.positionID
        //validation
        const errors=validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        //connection to database function
        const data= await service.deletePosition(positionID)
        if(data.ok) {
            return res.status(data.status).json(data.body)
        }
        return res.status(data.status).end()
     })

module.exports = router