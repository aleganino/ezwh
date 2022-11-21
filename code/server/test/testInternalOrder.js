const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
chai.should()

const app = require('../server')
var agent = chai.request.agent(app)

describe('Testing internalOrder API endpoints', function () {
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
   })

   describe('POST on internalOrder', function () {
      it('POST /api/internalOrders (201)', async () => {
         const result = await agent
            .post('/api/internalOrders')
            .set('content-type', 'application/json')
            .send({
               issueDate: '2022/05/24',
               products: [
                  {
                     SKUId: 1,
                     description: 'temporary sku 1',
                     price: 10.99,
                     qty: 3,
                  },
               ],
               customerId: 1,
            })
         result.should.have.status(201)
      })
      it('POST /api/internalOrders (201)', async () => {
         const result = await agent
            .post('/api/internalOrders')
            .set('content-type', 'application/json')
            .send({
               issueDate: '2022/05/23',
               products: [
                  {
                     SKUId: 1,
                     description: 'temporary sku 1',
                     price: 10.99,
                     qty: 3,
                  },
               ],
               customerId: 1,
            })
         result.should.have.status(201)
      })
   })

   describe('PUT on internalOrder', function () {
      it('PUT /api/internalOrders/:id (200)', async () => {
         const result = await agent
            .put('/api/internalOrders/1')
            .set('content-type', 'application/json')
            .send({
               newState: 'ACCEPTED',
            })
         result.should.have.status(200)
      })
      it('PUT /api/internalOrders/:id (404)', async () => {
         const result = await agent
            .put('/api/internalOrders/999')
            .set('content-type', 'application/json')
            .send({
               newState: 'ACCEPTED',
            })
         result.should.have.status(404)
      })
      it('PUT /api/internalOrders/:id (422)', async () => {
         const result = await agent
            .put('/api/internalOrders/1')
            .set('content-type', 'application/json')
            .send({
               newState: 'AAAAAA',
            })
         result.should.have.status(422)
      })
   })

   describe('GET on internalOrder', function () {
      it('GET /api/internalOrders (200)', async () => {
         const result = await agent.get('/api/internalOrders/')
         result.should.have.status(200)
         expect(result.body).to.be.an('array')
         expect(result.body).to.have.lengthOf(2)
      })
      it('GET /api/internalOrdersIssued (200)', async () => {
         const result = await agent.get('/api/internalOrdersIssued')
         result.should.have.status(200)
         expect(result.body).to.be.an('array')
         expect(result.body).to.have.lengthOf(1)
      })
      it('GET /api/internalOrdersAccepted (200)', async () => {
         const result = await agent.get('/api/internalOrdersAccepted')
         result.should.have.status(200)
         expect(result.body).to.be.an('array')
         expect(result.body).to.have.lengthOf(1)
      })
      it('GET /api/internalOrders/:id (200)', async () => {
         const result = await agent.get('/api/internalOrders/1')
         result.should.have.status(200)
         result.should.be.json
         expect(result.body).to.deep.equal({
            id: 1,
            issueDate: '2022/05/24',
            state: 'ACCEPTED',
            products: [
               {
                  SKUId: 1,
                  description: 'temporary sku 1',
                  price: 10.99,
                  qty: 3
               }
            ],
            customerId: 1,
         })
      })
   })

   describe('DELETE on internalOrder', function () {
      it('DELETE /api/internalOrders/:id (204)', async () => {
         const result = await agent.delete('/api/internalOrders/1')
         result.should.have.status(204)
      })
      it('DELETE /api/internalOrders/:id (204)', async () => {
         const result = await agent.delete('/api/internalOrders/2')
         result.should.have.status(204)
      })
   })

   after(async () => {
      await agent.delete('/api/skus/1')
      await agent.delete('/api/skuitem/123456789')
   })
})
