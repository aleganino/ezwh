const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const { beforeEach, afterEach } = require('mocha')

chai.use(chaiHttp)
chai.should()

const app = require('../server')
var agent = chai.request.agent(app)

describe("GET testResult", () => {

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
        await agent.post('/api/skuitem')        
        .set('content-type', 'application/json')
        .send(
            {
                RFID:"1111",
                SKUId:1,
                DateOfStock:"2021/11/29 12:30"
            }
        )
        await agent.post('/api/skuitems/testResult')
        .set('content-type', 'application/json')
        .send(
            {
                rfid:"1111",
                idTestDescriptor:1,
                Date:"2021/11/28",
                Result: true
            }
        )
        await agent.post('/api/skuitems/testResult')
        .set('content-type', 'application/json')
        .send(
            {
                rfid:"1111",
                idTestDescriptor:1,
                Date:"2021/11/28",
                Result: true
            }            
        )
    })

    after( async () => {
        await agent.delete('/api/skuitems/1111/testResult/1')
        await agent.delete('/api/skuitems/1111/testResult/2')
        await agent.delete('/api/testDescriptor/1') 
        await agent.delete('/api/skuitems/1111')
        await agent.delete('/api/skus/1')
    })

    it('GET /api/skuitems/1111/testResults', async () => {
        const result = await agent.get('/api/skuitems/1111/testResults')
        result.should.have.status(200)
        result.should.to.be.json
        expect(result.body).to.deep.equal(
            [
                {
                    id: 1,
                    idTestDescriptor:1,
                    Date:"2021/11/28",
                    Result: "true",
                    RFID: "1111"
                },
                {
                    id: 2,
                    idTestDescriptor:1,
                    Date:"2021/11/28",
                    Result: "true",
                    RFID: "1111"
                }

            ]
        )
    })

    it('GET /api/skuitems/1111/testResults/1', async () => {
        const result = await agent.get('/api/skuitems/1111/testResults/1')
        result.should.have.status(200)
        result.should.to.be.json
        expect(result.body).to.deep.equal(
            [
                {
                    id: 1,
                    idTestDescriptor:1,
                    Date:"2021/11/28",
                    Result: "true",
                    RFID: "1111"
                }
            ]
        )
    })

    it('GET /api/skuitems/1111/testResults/3', async () => {
        const result = await agent.get('/api/skuitems/1111/testResults/3')
        result.should.have.status(200)
        result.should.to.be.json
        expect(result.body).to.deep.equal([])
    })

    it('GET /api/skuitems/WrongRFID/testResults', async () => {
        const result = await agent.get('/api/skuitems/WrongRFID/testResults')
        result.should.have.status(422)
    })
})

describe("POST testResult", () => {

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
        await agent.post('/api/skuitem')        
        .set('content-type', 'application/json')
        .send(
            {
                RFID:"1111",
                SKUId:1,
                DateOfStock:"2021/11/29 12:30"
            }
        )
    })

    after( async () => {
        await agent.delete('/api/testDescriptor/1') 
        await agent.delete('/api/skuitems/1111')
        await agent.delete('/api/skus/1')
    })

    it("POST /api/skuitems/testResult", async () =>{
        const result = await agent.post('/api/skuitems/testResult')
        .set('content-type', 'application/json')
        .send(
            {
                rfid:"1111",
                idTestDescriptor:1,
                Date:"2021/11/28",
                Result: true
            }
        )
        result.should.have.status(201)
        await agent.delete("/api/skuitems/1111/testResult/1")
    })

    it("POST /api/skuitems/testResult (rfid not found)", async () =>{
        const result = await agent.post('/api/skuitems/testResult')
        .set('content-type', 'application/json')
        .send(
            {
                rfid:"Wrong rfid",
                idTestDescriptor:1,
                Date:"2021/11/28",
                Result: true
            }
        )
        result.should.have.status(422)
    })

    it("POST /api/skuitems/testResult (test descriptor id not found)", async () =>{
        const result = await agent.post('/api/skuitems/testResult')
        .set('content-type', 'application/json')
        .send(
            {
                rfid:"1111",
                idTestDescriptor:1234,
                Date:"2021/11/28",
                Result: true
            }
        )
        result.should.have.status(404)
    })

    it("POST /api/skuitems/testResult (wrong body)", async () =>{
        const result = await agent.post('/api/skuitems/testResult')
        .set('content-type', 'application/json')
        .send(
            {
                rfid:"1111",
                idTestDescriptor:"Wrong Id",
                Date:"2021/11/28",
                Result: true
            }
        )
        result.should.have.status(422)
    })

})

describe("PUT testResult", () => {

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
        await agent.post('/api/skuitem')        
        .set('content-type', 'application/json')
        .send(
            {
                RFID:"1111",
                SKUId:1,
                DateOfStock:"2021/11/29 12:30"
            }
        )
        await agent.post('/api/skuitems/testResult')
        .set('content-type', 'application/json')
        .send(
            {
                rfid:"1111",
                idTestDescriptor:1,
                Date:"2021/11/28",
                Result: true
            }
        )
        await agent.post('/api/skuitems/testResult')
        .set('content-type', 'application/json')
        .send(
            {
                rfid:"1111",
                idTestDescriptor:1,
                Date:"2021/11/28",
                Result: true
            }            
        )
    })

    after( async () => {
        await agent.delete('/api/skuitems/1111/testResult/1')
        await agent.delete('/api/skuitems/1111/testResult/2')
        await agent.delete('/api/testDescriptor/1') 
        await agent.delete('/api/skuitems/1111')
        await agent.delete('/api/skus/1')
    })

    it("PUT /api/skuitems/1111/testResult/1", async () =>{
        const result = await agent.put('/api/skuitems/1111/testResult/1')
        .set('content-type', 'application/json')
        .send(
            {
                newIdTestDescriptor: 1,
                newDate:"2021/11/29",
                newResult: false
            }
        )
        result.should.have.status(200)
    })

    it("PUT /api/skuitems/WrongRFID/testResult/1", async () =>{
        const result = await agent.put('/api/skuitems/WrongRFID/testResult/1')
        .set('content-type', 'application/json')
        .send(
            {
                newIdTestDescriptor: 1,
                newDate:"2021/11/29",
                newResult: false
            }
        )
        result.should.have.status(422)
    })

    it("PUT /api/skuitems/1111/testResult/1234", async () =>{
        const result = await agent.put('/api/skuitems/1111/testResult/1234')
        .set('content-type', 'application/json')
        .send(
            {
                newIdTestDescriptor: 1,
                newDate:"2021/11/29",
                newResult: false
            }
        )
        result.should.have.status(404)
    })

    it("PUT /api/skuitems/WrongRFID/testResult/WrongId", async () =>{
        const result = await agent.put('/api/skuitems/WrongRFID/testResult/WrongId')
        .set('content-type', 'application/json')
        .send(
            {
                newIdTestDescriptor: 1,
                newDate:"2021/11/29",
                newResult: false
            }
        )
        result.should.have.status(422)
    })
})

describe("DELETE testResult", () => {

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
        await agent.post('/api/skuitem')        
        .set('content-type', 'application/json')
        .send(
            {
                RFID:"1111",
                SKUId:1,
                DateOfStock:"2021/11/29 12:30"
            }
        )
        await agent.post('/api/skuitems/testResult')
        .set('content-type', 'application/json')
        .send(
            {
                rfid:"1111",
                idTestDescriptor:1,
                Date:"2021/11/28",
                Result: true
            }
        )
        await agent.post('/api/skuitems/testResult')
        .set('content-type', 'application/json')
        .send(
            {
                rfid:"1111",
                idTestDescriptor:1,
                Date:"2021/11/28",
                Result: true
            }            
        )
    })

    after( async () => {
        await agent.delete('/api/skuitems/1111/testResult/1')
        await agent.delete('/api/skuitems/1111/testResult/2')
        await agent.delete('/api/testDescriptor/1') 
        await agent.delete('/api/skuitems/1111')
        await agent.delete('/api/skus/1')
    })

    it("DELETE /api/skuitems/1111/testResult/1", async () => {
        const result = await agent.delete('/api/skuitems/1111/testResult/1')
        result.should.have.status(204)
    })

    it("DELETE /api/skuitems/WrongRFID/testResult/1", async () => {
        const result = await agent.delete('/api/skuitems/WrongRFID/testResult/1')
        result.should.have.status(422)
    })

    it("DELETE /api/skuitems/1111/testResult/1234", async () => {
        const result = await agent.delete('/api/skuitems/1111/testResult/1234')
        result.should.have.status(404)
    })

    it("DELETE /api/skuitems/1111/testResult/WrongId", async () => {
        const result = await agent.delete('/api/skuitems/1111/testResult/WrongId')
        result.should.have.status(422)
    })
})