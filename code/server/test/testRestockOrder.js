const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
chai.should()

const app = require('../server')
var agent = chai.request.agent(app)

describe('Testing restockOrder API endpoints', function () {
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

   describe('POST on restockOrder', function () {
      it('POST /api/restockOrder (201)', async () => {
         const result = await agent
            .post('/api/restockOrder')
            .set('content-type', 'application/json')
            .send({
               issueDate: '2022/05/24',
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
         result.should.have.status(201)
      })
      it('POST /api/restockOrder (201)', async () => {
         const result = await agent
            .post('/api/restockOrder')
            .set('content-type', 'application/json')
            .send({
               issueDate: '2022/05/23',
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
         result.should.have.status(201)
      })
      it('POST /api/restockOrder (422)', async () => {
         const result = await agent
            .post('/api/restockOrder')
            .set('content-type', 'application/json')
            .send({
               issueDate: '2022/05/23',
               products: [
                  {
                     SKUId: 1,
                     description: 'temporary sku 1',
                     price: 10.99,
                     qty: 30,
                  },
               ],
               supplierId: 999,
            })
         result.should.have.status(422)
      })
   })

   describe('PUT on restockOrder', function () {
      it('PUT /api/restockOrder/:id (200)', async () => {
         const result = await agent
            .put('/api/restockOrder/1')
            .set('content-type', 'application/json')
            .send({
               newState: 'DELIVERY',
            })
         result.should.have.status(200)
      })
      it('PUT /api/restockOrder/:id/skuItems (200)', async () => {
         const result = await agent
            .put('/api/restockOrder/1/skuItems')
            .set('content-type', 'application/json')
            .send({
               skuItems: [
                  {
                     SKUId: 1,
                     rfid: '123456789',
                  },
               ],
            })
         result.should.have.status(200)
      })
      it('PUT /api/restockOrder/:id/skuItems (404)', async () => {
         const result = await agent
            .put('/api/restockOrder/999/skuItems')
            .set('content-type', 'application/json')
            .send({
               skuItems: [
                  {
                     SKUId: 1,
                     rfid: '123456789',
                  },
               ],
            })
         result.should.have.status(404)
      })
      it('PUT /api/restockOrder/:id/transportNote (200)', async () => {
         const result = await agent
            .put('/api/restockOrder/1/transportNote')
            .set('content-type', 'application/json')
            .send({
               transportNote: { deliveryDate: '2022/05/25' },
            })
         result.should.have.status(200)
      })
      it('PUT /api/restockOrder/:id/transportNote (404)', async () => {
         const result = await agent
            .put('/api/restockOrder/999/transportNote')
            .set('content-type', 'application/json')
            .send({
               transportNote: { deliveryDate: '2022/05/25' },
            })
         result.should.have.status(404)
      })
   })

   describe('GET on restockOrder', function () {
      it('GET /api/restockOrders (200)', async () => {
         const result = await agent.get('/api/restockOrders')
         result.should.have.status(200)
         expect(result.body).to.be.an('array')
         expect(result.body).to.have.lengthOf(2)
      })
      it('GET /api/restockOrdersIssued (200)', async () => {
         const result = await agent.get('/api/restockOrdersIssued')
         result.should.have.status(200)
         expect(result.body).to.be.an('array')
         expect(result.body).to.have.lengthOf(1)
      })
      it('GET /api/restockOrders/:id (200)', async () => {
         const result = await agent.get('/api/restockOrders/1')
         result.should.have.status(200)
         result.should.be.json
         expect(result.body).to.deep.equal({
            id: 1,
            issueDate: '2022/05/24',
            state: 'DELIVERY',
            products: [
               {
                  SKUId: 1,
                  description: 'temporary sku 1',
                  price: 10.99,
                  qty: 30,
               },
            ],
            supplierId: 1,
            transportNote: { deliveryDate: '2022/05/25' },
            skuItems: [
               {
                  SKUId: 1,
                  rfid: '123456789',
               },
            ],
         })
      })
      it('GET /api/restockOrders/:id/returnItems (200)', async () => {
         const result = await agent.get('/api/restockOrders/1/returnItems')
         result.should.have.status(200)
         result.should.be.json
         expect(result.body).to.deep.equal([
            {
               SKUId: 1,
               rfid: '123456789',
            },
         ])
      })
   })

   describe('DELETE on restockOrder', function () {
      it('DELETE /api/restockOrder/:id (204)', async () => {
         const result = await agent.delete('/api/restockOrder/1')
         result.should.have.status(204)
      })
      it('DELETE /api/restockOrder/:id (204)', async () => {
         const result = await agent.delete('/api/restockOrder/2')
         result.should.have.status(204)
      })
   })

   after(async () => {
      await agent.delete('/api/skus/1')
      await agent.delete('/api/skuitem/123456789')
   })
})
