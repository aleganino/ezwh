'use strict'

const express = require('express')
const apiUrl = '/api'

// init express
const app = new express()
const port = 3001
app.use(express.json())

//init database
exports.databasePath = './db/ezwhdb.db'

//API ENDPOINTS
//Edo
const ItemRouter = require('./api/routers/item_router')
const InternalOrder = require('./api/routers/internalOrder_router')
const ReturnOrder = require('./api/routers/returnOrder_router')
const UserRouter = require('./api/routers/user_router')
app.use(apiUrl, ItemRouter)
app.use(apiUrl, InternalOrder)
app.use(apiUrl, ReturnOrder)
app.use(apiUrl, UserRouter)

//Gabri
const SkuRouter = require('./api/routers/sku')
const SkuItemRouter = require('./api/routers/skuItem')
const PositionRouter = require('./api/routers/position')
app.use(apiUrl, SkuRouter)
app.use(apiUrl, SkuItemRouter)
app.use(apiUrl, PositionRouter)

//Ale
const TestDescriptor = require('./api/routers/testDescriptorRouter')
const TestResult = require('./api/routers/testResultRouter')
app.use(apiUrl, TestDescriptor)
app.use(apiUrl, TestResult)

// Shahab
const RestockOrderRouter = require('./api/routers/restockOrder_router')
app.use(apiUrl, RestockOrderRouter)
//API ENDPOINTS

// activate the server
app.listen(port, () => {
   console.log(`Server listening at http://localhost:${port}`)
})

module.exports = app
