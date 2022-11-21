const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
chai.should()

const app = require('../server')
var agent = chai.request.agent(app)

describe('Testing returnOrder API endpoints', function () {
   before(async () => {
      //sku 1
      await agent
         .post('/api/sku')
         .set('content-type', 'application/json')
         .send({
            description: 'temporary sku 1',
            weight: 100,
            volume: 50,
            notes: 'temporary sku',
            price: 10.99,
            availableQuantity: 50,
         })
      //skuitem 1
      await agent
         .post('/api/skuitem')
         .set('content-type', 'application/json')
         .send({
            RFID: '123456789',
            SKUId: 1,
            DateOfStock: '2022/05/25',
         })
      //restockOrder
      await agent
         .post('/api/restockOrder')
         .set('content-type', 'application/json')
         .send({
            issueDate: '2021/11/29 09:33',
            products: [
               {
                  SKUId: 1,
                  description: 'temporary sku 1',
                  price: 10.99,
                  qty: 30,
               },
            ],
            supplierId: 1,
         })
   })

   describe('POST on returnOrder', function () {
      it('POST /api/returnOrder (201)', async () => {
         const result = await agent
            .post('/api/returnOrder')
            .set('content-type', 'application/json')
            .send({
               returnDate: '2022/05/24',
               products: [
                  {
                     SKUId: 1,
                     description: 'temporary sku 1',
                     price: 10.99,
                     RFID: '123456789',
                  },
               ],
               restockOrderId: 1,
            })
         result.should.have.status(201)
      })
      it('POST /api/returnOrder (404)', async () => {
         const result = await agent
            .post('/api/returnOrder')
            .set('content-type', 'application/json')
            .send({
               returnDate: '2022/05/24',
               products: [
                  {
                     SKUId: 1,
                     description: 'temporary sku 1',
                     price: 10.99,
                     RFID: '123456789',
                  },
               ],
               restockOrderId: 999,
            })
         result.should.have.status(404)
      })
   })

   describe('PUT on returnOrder', function () {})

   describe('GET on returnOrder', function () {
      it('GET /api/returnOrders (200)', async () => {
         const result = await agent.get('/api/returnOrders')
         result.should.have.status(200)
         expect(result.body).to.be.an('array')
         expect(result.body).to.have.lengthOf(1)
      })
      it('GET /api/returnOrders/:id (200)', async () => {
         const result = await agent.get('/api/returnOrders/1')
         result.should.have.status(200)
         result.should.be.json
         expect(result.body).to.deep.equal({
            id: 1,
            returnDate: '2022/05/24',
            products: [
               {
                  SKUId: 1,
                  description: 'temporary sku 1',
                  price: 10.99,
                  RFID: '123456789',
               },
            ],
            restockOrderId: 1,
         })
      })
   })

   describe('DELETE on returnOrder', function () {
      it('DELETE /api/returnOrder/:id (204)', async () => {
         const result = await agent.delete('/api/returnOrder/1')
         result.should.have.status(204)
      })
   })

   after(async () => {
      await agent.delete('/api/skus/1')
      await agent.delete('/api/skuitem/123456789')
      await agent.delete('/api/restockOrder/1')
   })
})
