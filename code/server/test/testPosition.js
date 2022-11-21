const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
chai.should()

const app = require('../server')
var agent = chai.request.agent(app)

describe('CRUD on position (test position with id = 800234543412)', function () {

   // create the position
   it('POST /api/position', async () => {
      const result = await agent
         .post('/api/position')
         .set('content-type', 'application/json')
         .send({
            "positionID":"800234543412",
            "aisleID": "8002",
            "row": "3454",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000
         })
      result.should.have.status(201)
   })

   // get the position
   it('GET /api/positions created', async () => {
      const result = await agent.get('/api/positions')
      result.should.have.status(200)
      result.should.to.be.json
      const body=result.body.filter((f)=>f.positionID=='800234543412')[0]

      expect(body).to.deep.equal(
        {
            "positionID":"800234543412",
            "aisleID": "8002",
            "row": "3454",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000,
            "occupiedWeight": 0,
            "occupiedVolume":0
        })
   })

   // modify the position 
   it('PUT /api/position/800234543412', async () => {
      const result = await agent
         .put('/api/position/800234543412')
         .set('content-type', 'application/json')
         .send({
            "newAisleID": "1111",
            "newRow": "2222",
            "newCol": "3333",
            "newMaxWeight": 1200,
            "newMaxVolume": 600,
            "newOccupiedWeight": 200,
            "newOccupiedVolume":100
        })
      result.should.have.status(200)
   })

   // check if the position has been modified
   it('GET /api/positions modified', async () => {
      const result = await agent.get('/api/positions')
      result.should.have.status(200)
      result.should.to.be.json
      const body=result.body.filter((f)=>f.positionID=='111122223333')[0]
      expect(body).to.deep.equal({
        "positionID":"111122223333",
        "aisleID": "1111",
        "row": "2222",
        "col": "3333",
        "maxWeight": 1200,
        "maxVolume": 600,
        "occupiedWeight": 200,
        "occupiedVolume":100
    })
   })

   // modify the position id (which updates aisle, row and col)
   it('PUT /api/position/111122223333/changeID', async () => {
    const result = await agent
       .put('/api/position/111122223333/changeID')
       .set('content-type', 'application/json')
       .send({
            "newPositionID": "800234543412"
        })
    result.should.have.status(200)
    })

    // check if aisle, row, col have been modified after the positionID update
    it('GET /api/positions id modified', async () => {
        const result = await agent.get('/api/positions')
        result.should.have.status(200)
        result.should.to.be.json
        const body=result.body.filter((f)=>f.positionID=='800234543412')[0]
        expect(body).to.deep.equal({
        "positionID":"800234543412",
        "aisleID": "8002",
        "row": "3454",
        "col": "3412",
        "maxWeight": 1200,
        "maxVolume": 600,
        "occupiedWeight": 200,
        "occupiedVolume":100
        })
    })   


   // delete the position
   it('DELETE /api/position/800234543412', async () => {
      const result = await agent.delete('/api/position/800234543412')
      result.should.have.status(204)
   })

    // modify a position which doesn't exist
    it('PUT /api/position/800234543412/changeID inexistent', async () => {
        const result = await agent
        .put('/api/position/800234543412/changeID')
        .set('content-type', 'application/json')
        .send({
                "newPositionID": "800234543412"
            })
        result.should.have.status(404)
        })

    // modify a position failing the validation (positionID expected to be numeric and long 12)
    it('PUT /api/position/AAAABBBBCCCC/changeID invalid', async () => {
        const result = await agent
        .put('/api/position/AAAABBBBCCCC/changeID')
        .set('content-type', 'application/json')
        .send({
                "newPositionID": "8002"
            })
        result.should.have.status(422)
        })
   
})
