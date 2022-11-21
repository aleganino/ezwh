const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
chai.should()

const app = require('../server')
var agent = chai.request.agent(app)

describe('Testing item API endpoints', function () {
   before(async () => {
      // sku1
      await agent
         .post('/api/sku')
         .set('content-type', 'application/json')
         .send({
            description: 'temporary sku',
            weight: 100,
            volume: 50,
            notes: 'temporary sku',
            price: 10.99,
            availableQuantity: 50,
         })
   })

   describe('POST on item', function () {
      it('POST /api/item (201)', async () => {
         const result = await agent
            .post('/api/item')
            .set('content-type', 'application/json')
            .send({
               id: 1,
               description: 'test item description',
               price: 10.99,
               SKUId: 1,
               supplierId: 1,
            })
         result.should.have.status(201)
      })
      it('POST /api/item (404)', async () => {
         const result = await agent
            .post('/api/item')
            .set('content-type', 'application/json')
            .send({
               id: 1,
               description: 'test item description',
               price: 10.99,
               SKUId: 999,
               supplierId: 1,
            })
         result.should.have.status(404)
      })
   })

   describe('PUT on item', function () {
      it('PUT /api/item/:id (200)', async () => {
         const result = await agent
            .put('/api/item/1')
            .set('content-type', 'application/json')
            .send({
               newDescription: 'new test item description',
               newPrice: 12.99,
            })
         result.should.have.status(200)
      })
      it('PUT /api/item/:id (404)', async () => {
         const result = await agent
            .put('/api/item/999')
            .set('content-type', 'application/json')
            .send({
               newDescription: 'new test item description',
               newPrice: 12.99,
            })
         result.should.have.status(404)
      })
   })

   describe('GET on item', function () {
      it('GET /api/items (200)', async () => {
         const result = await agent.get('/api/items')
         result.should.have.status(200)
         expect(result.body).to.be.an('array')
         expect(result.body).to.have.lengthOf(1)
      })
      it('GET /api/items/:id (200)', async () => {
         const result = await agent.get('/api/items/1')
         result.should.have.status(200)
         result.should.be.json
         expect(result.body).to.deep.equal({
            id: 1,
            description: 'new test item description',
            price: 12.99,
            SKUId: 1,
            supplierId: 1,
         })
      })
      it('GET /api/items/:id (404)', async () => {
         const result = await agent.get('/api/items/999')
         result.should.have.status(404)
      })
   })

   describe('DELETE on item', function () {
      it('DELETE /api/items/:id (204)', async () => {
         const result = await agent.delete('/api/items/1')
         result.should.have.status(204)
      })
   })

   after(async () => {
      await agent.delete('/api/skus/1')
   })
})
