const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
chai.should()

const app = require('../server')
var agent = chai.request.agent(app)

describe('CRUD on sku item (test sku with rfid = "12345678901234567890123456789015", skuid="1719")', function () {
    before(async ()=>{
        await agent.post('/api/sku')
            .set('content-type', 'application/json')
            .send({
                "description" : "test sku #1719",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "price" : 10.99,
                "availableQuantity" : 50
            })
        
    
    })
    after(async ()=>{
        await agent.delete('/api/skus/1')
    })

    // create 2 sku items
    it('POST /api/skuitem', async () => {
        const result1 = await agent
            .post('/api/skuitem')
            .set('content-type', 'application/json')
            .send({
                "RFID":"12345678901234567890123456789015",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
        })
        result1.should.have.status(201)

        const result2 = await agent
            .post('/api/skuitem')
            .set('content-type', 'application/json')
            .send({
                "RFID":"3333444433334444",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
        })
        result2.should.have.status(201)
    })

    // check that you can't create a sku item with the same rfid
    it('POST /api/skuitem already existing', async () => {
        const result = await agent
            .post('/api/skuitem')
            .set('content-type', 'application/json')
            .send({
                "RFID":"12345678901234567890123456789015",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
        })
        result.should.have.status(503)
    })

    // modify the sku item #1
    it('PUT /api/skuitems/12345678901234567890123456789015', async () => {
        const result = await agent
        .put('/api/skuitems/12345678901234567890123456789015')
        .set('content-type', 'application/json')
        .send({
            "newRFID":"12345678901234567890123456789015",
            "newAvailable":1,
            "newDateOfStock":"2021/11/29 12:30"
        })
        result.should.have.status(200)
    })
    // modify the sku item #2
    it('PUT /api/skuitems/3333444433334444', async () => {
        const result = await agent
        .put('/api/skuitems/3333444433334444')
        .set('content-type', 'application/json')
        .send({
            "newRFID":"3333444433334444",
            "newAvailable":1,
            "newDateOfStock":"2021/11/29 12:30"
        })
        result.should.have.status(200)
    })

   // get the 2 sku items (by fitlering the list having sku=1)
   it('GET /api/skuitems/sku/1', async () => {
        const result = await agent.get('/api/skuitems/sku/1')
        result.should.have.status(200)
        result.should.to.be.json
        body=result.body.filter((f)=>(f.RFID==12345678901234567890123456789015||f.RFID==3333444433334444))
        expect(body).to.deep.equal(
            [{
                "RFID":"12345678901234567890123456789015",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30",
            },{
                "RFID":"3333444433334444",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30",
            }])
   })

    // delete the position
    it('DELETE /api/skuitems/11112222', async () => {
        const result = await agent.delete('/api/skuitems/3333444433334444')
        result.should.have.status(204)
    })
    it('DELETE /api/skuitems/11112222', async () => {
        const result = await agent.delete('/api/skuitems/12345678901234567890123456789015')
        result.should.have.status(204)
    })

    // check that there is no sku item after the delete
    it('GET /api/skuitems empty list', async () => {
        const result = await agent.get('/api/skuitems/sku/1')
        result.should.have.status(200)
        result.should.to.be.json
        body=result.body.filter((f)=>(f.RFID==12345678901234567890123456789015||f.RFID==3333444433334444))
        expect(body).to.deep.equal(
            [
            ])
    })


    // create a sku item with inexistent skuID
    it('POST /api/skuitem inexisting sku', async () => {
        const result = await agent
            .post('/api/skuitem')
            .set('content-type', 'application/json')
            .send({
                "RFID":"12345678901234567890123456789015",
                "SKUId":1719,
                "DateOfStock":"2021/11/29 12:30"
        })
        result.should.have.status(404)
    })

    // create a sku item failing validation
    it('POST /api/skuitem invalid', async () => {
        const result = await agent
            .post('/api/skuitem')
            .set('content-type', 'application/json')
            .send({
                "RFID":"ABCD",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
        })
        result.should.have.status(422)
    })
    
})
