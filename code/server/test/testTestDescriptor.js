const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const { beforeEach, afterEach } = require('mocha')

chai.use(chaiHttp)
chai.should()

const app = require('../server')
var agent = chai.request.agent(app)

describe("GET testDescriptor", () => {

    before( async () => {
        await agent.post('/api/sku')
        .set('content-type', 'application/json')
        .send(
            {
                "description" : "a new sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "price" : 10.99,
                "availableQuantity" : 50
            }
        )
        await agent.post('/api/testDescriptor')
        .set('content-type', 'application/json')
        .send(
            {
                name:"test descriptor 1",
                procedureDescription:"This test is described by...",
                idSKU : 1
            }
        )
        await agent.post('/api/testDescriptor')
        .set('content-type', 'application/json')
        .send(
            {
                name:"test descriptor 2",
                procedureDescription:"This test is described by...",
                idSKU : 1
            }
        )
    })

    after( async () => {
        await agent.delete('/api/testDescriptor/1')
        await agent.delete('/api/testDescriptor/2')
        await agent.delete('/api/skus/1')
    })

    it('GET /api/testDescriptors', async () => {
        const result = await agent.get('/api/testDescriptors')
        result.should.have.status(200)
        result.should.to.be.json
        expect(result.body).to.deep.equal(
            [
                {
                    id: 1,
                    name:"test descriptor 1",
                    procedureDescription:"This test is described by...",
                    idSKU :1
                },
                {
                    id: 2,
                    name:"test descriptor 2",
                    procedureDescription:"This test is described by...",
                    idSKU :1
                }
            ]
        )
    })

    it('GET /api/testDescriptors/1', async () => {
        const result = await agent.get('/api/testDescriptors/1')
        result.should.have.status(200)
        result.should.to.be.json
        expect(result.body).to.deep.equal(
                {
                    "id": 1,
                    "name": "test descriptor 1",
                    "procedureDescription": "This test is described by...",
                    "idSKU": 1
                }

        )
    })

    it('GET /api/testDescriptors/3', async () => {
        const result = await agent.get('/api/testDescriptors/3')
        result.should.have.status(404)
    })

})

describe("POST testDescriptor", () => {

    before(async () => {
        await agent.post('/api/sku')
        .set('content-type', 'application/json')
        .send(
            {
                "description" : "a new sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "price" : 10.99,
                "availableQuantity" : 50
            }
        )        
    })

    after( async () => {
        await agent.delete('/api/skus/1')
    })

    it('POST /api/testDescriptor', async () => {
        const result = await agent
            .post('/api/testDescriptor')
            .set('content-type', 'application/json')
            .send(
                {
                    name:"test descriptor 1",
                    procedureDescription:"This test is described by...",
                    idSKU :1
                }
        )
        result.should.have.status(201)
        await agent.delete('/api/testDescriptor/1')
    })

    it('POST /api/testDescriptor (wrong body)', async () => {
        const result = await agent
            .post('/api/testDescriptor')
            .set('content-type', 'application/json')
            .send(
                {
                    name:"test descriptor 1",
                    procedureDescription:"This test is described by...",
                    idSKU : "Wrong"
                }
        )
        result.should.have.status(422)
    })

})

describe("PUT testDescriptor", () => {

    before( async () => {
        await agent.post('/api/sku')
        .set('content-type', 'application/json')
        .send(
            {
                "description" : "a new sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "price" : 10.99,
                "availableQuantity" : 50
            }
        )
        await agent.post('/api/testDescriptor')
        .set('content-type', 'application/json')
        .send(
            {
                name:"test descriptor 1",
                procedureDescription:"This test is described by...",
                idSKU : 1
            }
        )
        await agent.post('/api/testDescriptor')
        .set('content-type', 'application/json')
        .send(
            {
                name:"test descriptor 2",
                procedureDescription:"This test is described by...",
                idSKU : 1
            }
        )
    })

    after( async () => {
        await agent.delete('/api/testDescriptor/1')
        await agent.delete('/api/testDescriptor/2')
        await agent.delete('/api/skus/1')
    })

    it('PUT /api/testDescriptor/1', async () => {
        const result = await agent
        .put('/api/testDescriptor/1')
        .set('content-type', 'application/json')
        .send(
            {
                newName:"new test descriptor 1",
                newProcedureDescription:"This test is described by...",
                newIdSKU :1
            }
        )
        result.should.have.status(200)        
    })

    it('PUT /api/testDescriptor/1111', async () => {
        const result = await agent
        .put('/api/testDescriptor/1111')
        .set('content-type', 'application/json')
        .send(
            {
                newName:"new test descriptor 1",
                newProcedureDescription:"This test is described by...",
                newIdSKU :1
            }
        )
        result.should.have.status(404)        
    })

    it('PUT /api/testDescriptor/WrongId', async () => {
        const result = await agent
        .put('/api/testDescriptor/1')
        .set('content-type', 'application/json')
        .send(
            {
                newName:"new test descriptor 1",
                newProcedureDescription:"This test is described by...",
                newIdSKU : "Wrong"
            }
        )
        result.should.have.status(422)        
    })

    it('PUT /api/testDescriptor/1 (wrong body)', async () => {
        const result = await agent
        .put('/api/testDescriptor/1')
        .set('content-type', 'application/json')
        .send(
            {
                newName:"new test descriptor 1",
                newProcedureDescription:"This test is described by...",
                newIdSKU : "Wrong"
            }
        )
        result.should.have.status(422)        
    })

})

describe("DELETE testDescriptor", () => {

    before( async () => {
        await agent.post('/api/sku')
        .set('content-type', 'application/json')
        .send(
            {
                "description" : "a new sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "price" : 10.99,
                "availableQuantity" : 50
            }
        )
        await agent.post('/api/testDescriptor')
        .set('content-type', 'application/json')
        .send(
            {
                name:"test descriptor 1",
                procedureDescription:"This test is described by...",
                idSKU : 1
            }
        )
        await agent.post('/api/testDescriptor')
        .set('content-type', 'application/json')
        .send(
            {
                name:"test descriptor 2",
                procedureDescription:"This test is described by...",
                idSKU : 1
            }
        )
    })

    after( async () => {
        await agent.delete('/api/testDescriptor/1')
        await agent.delete('/api/testDescriptor/2')
        await agent.delete('/api/skus/1')
    })

    it('DELETE /api/testDescriptor/1', async () => {
        const result = await agent.delete('/api/testDescriptor/1')
        result.should.have.status(204)        
    })

    it('DELETE /api/testDescriptor/1111', async () => {
        const result = await agent.delete('/api/testDescriptor/1111')
        result.should.have.status(404)        
    })

    it('DELETE /api/testDescriptor/WrongId', async () => {
        const result = await agent.delete('/api/testDescriptor/WrongId')
        result.should.have.status(422)        
    })

})