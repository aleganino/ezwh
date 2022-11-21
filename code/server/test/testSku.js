const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
chai.should()

const app = require('../server')
var agent = chai.request.agent(app)

describe('CRUD on sku (test two skus with description = "test sku #1719" and "test sku #9999")', function () {
    before(async ()=>{
        await agent.post('/api/position')
            .set('content-type', 'application/json')
            .send({
                "positionID":"100010001000",
                "aisleID": "8002",
                "row": "3454",
                "col": "3412",
                "maxWeight": 1000,
                "maxVolume": 1000
            })
        await agent.post('/api/position')
            .set('content-type', 'application/json')
            .send({
                "positionID":"900090009000",
                "aisleID": "8002",
                "row": "3454",
                "col": "3412",
                "maxWeight": 500,
                "maxVolume": 500
            })
    })
    after(async ()=>{
        await agent.delete('/api/position/100010001000')
        await agent.delete('/api/position/900090009000')
    })

    // create the sku #1
    it('POST /api/sku 1', async () => {
        const result = await agent
            .post('/api/sku')
            .set('content-type', 'application/json')
            .send({
                "description" : "test sku #1719",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "price" : 10.99,
                "availableQuantity" : 50
            }
        )
        result.should.have.status(201)
    })
    // create the sku #2
    it('POST /api/sku 2', async () => {
        const result = await agent
            .post('/api/sku')
            .set('content-type', 'application/json')
            .send({
                "description" : "test sku #9999",
                "weight" : 9999,
                "volume" : 9999,
                "notes" : "second SKU",
                "price" : 10.99,
                "availableQuantity" : 50
            }
        )
        result.should.have.status(201)
    })

   // get the sku (by fitlering the complete list)
   it('GET /api/skus created', async () => {
      const result = await agent.get('/api/skus')
      result.should.have.status(200)
      result.should.to.be.json
      const body=result.body.filter((f)=>(f.description=='test sku #1719'||f.description=='test sku #9999'))
      expect(body).to.deep.equal(
        [{
            "id":1,
            "description" : "test sku #1719",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "availableQuantity" : 50,
            "price" : 10.99,
            "testDescriptors" : [],
            "position":null,
        },{
            "id":2,
            "description" : "test sku #9999",
            "weight" : 9999,
            "volume" : 9999,
            "notes" : "second SKU",
            "price" : 10.99,
            "availableQuantity" : 50,
            "testDescriptors" : [],
            "position":null,
        }])
   })

   // modify the sku 
   it('PUT /api/sku/1', async () => {
      const result = await agent
         .put('/api/sku/1')
         .set('content-type', 'application/json')
         .send({
            "newDescription" : "a new modified sku",
            "newWeight" : 200,
            "newVolume" : 200,
            "newNotes" : "first modified SKU",
            "newPrice" : 10.99,
            "newAvailableQuantity" : 50
        })
      result.should.have.status(200)
   })

   // check if the sku has been modified (this time testing the get by ID)
    it('GET /api/skus/1 by id modified', async () => {
        const result = await agent.get('/api/skus/1')
        result.should.have.status(200)
        result.should.to.be.json
        expect(result.body).to.deep.equal({
            "id":1,
            "description" : "a new modified sku",
            "weight" : 200,
            "volume" : 200,
            "notes" : "first modified SKU",
            "price" : 10.99,
            "availableQuantity" : 50,
            "testDescriptors" : [],
            "position":null,
        })
    })

   // modify the position id (which updates aisle, row and col)
   it('PUT /api/sku/1/position', async () => {
    const result = await agent
       .put('/api/sku/1/position')
       .set('content-type', 'application/json')
       .send({
        "position": "100010001000"
    })
    result.should.have.status(200)
    })

    // modify the position id to one already assigned
    it('PUT /api/sku/2/position assigned', async () => {
        const result = await agent
        .put('/api/sku/2/position')
        .set('content-type', 'application/json')
        .send({
            "position": "100010001000"
        })
        result.should.have.status(422)
    })
    // modify the position id to one incapable to to satisfy the weight constraints
    it('PUT /api/sku/2/position full', async () => {
        const result = await agent
        .put('/api/sku/2/position')
        .set('content-type', 'application/json')
        .send({
            "position": "900090009000"
        })
        result.should.have.status(422)
    })

    // check if the sku position has been modified
    it('GET /api/skus/1 check position', async () => {
        const result = await agent.get('/api/skus/1')
        result.should.have.status(200)
        result.should.to.be.json
        expect(result.body).to.deep.equal({
        "id":1,
        "description" : "a new modified sku",
        "weight" : 200,
        "volume" : 200,
        "notes" : "first modified SKU",
        "price" : 10.99,
        "position" : "100010001000",
        "availableQuantity" : 50,
        "testDescriptors" : []
        })
    })  


   // delete the sku #1
   it('DELETE /api/skus/1', async () => {
      const result = await agent.delete('/api/skus/1')
      result.should.have.status(204)
   })
   // delete the sku #2
   it('DELETE /api/skus/2', async () => {
        const result = await agent.delete('/api/skus/2')
        result.should.have.status(204)
    })
    // get a sku which doesn't exist
    it('GET 404 /api/skus/1719', async () => {
        const result = await agent.get('/api/skus/1')
        result.should.have.status(404)
    })

    // creating a sku failing the validation
    it('POST 422 /api/sku invalid', async () => {
        const result = await agent
            .post('/api/sku')
            .set('content-type', 'application/json')
            .send({
                "description" : "test sku #1719",
                "weight" : "ABC", // should be numeric
                "volume" : 50,
                "notes" : "first SKU",
                "price" : 10.99,
                "availableQuantity" : 50
            }
        )
        result.should.have.status(422)
    })
})
