const PositionService = require('../api/services/position_service')
const PositionDao = require('../api/modules/mock/mock_position_dao')

const service = new PositionService(PositionDao)

describe("test positions", () => {
   beforeAll(() => {
      PositionDao.getPositions.mockReset()
      PositionDao.editPosition.mockReset()
      PositionDao.getPositions.mockResolvedValue(
          [{
        positionID:"800234543412",
        aisleID: "8002",
        row: "3454",
        col: "3412",
        maxWeight: 1000,
        maxVolume: 1000,
        occupiedWeight: 300,
        occupiedVolume:150
      },{
        positionID:"801234543412",
        aisleID: "8012",
        row: "3454",
        col: "3412",
        maxWeight: 1000,
        maxVolume: 1000,
        occupiedWeight: 300,
        occupiedVolume:150
      }])
      PositionDao.createPosition.mockResolvedValue(true);
      PositionDao.deletePosition.mockRejectedValue('id not found');
      PositionDao.editPositionID.mockRejectedValue("error");
      PositionDao.editPosition.mockResolvedValueOnce(true).mockRejectedValueOnce("id not found");
   })

   describe("delete position", () => {
      test('delete position not found', async () => {
         const result = await service.deletePosition()
         expect(result.status).toEqual(
            404
         )
      })
   })

   describe("edit position", () => { 
      test('edit position successful', async () => {
         const result = await service.editPosition("111100001111", "1111", "0000", "1111", 1000, 1000, 10, 10)
         expect(result.status).toEqual(
            200
         )
      })
      test('edit position not found', async () => {
         const result = await service.editPosition("111100001111", "1111", "0000", "1111", 1000, 1000, 10, 10)
         expect(result.status).toEqual(
            404
         )
      })
   })

   describe("edit positionID unsuccessful", () => {
      test('edit positionID', async () => {
         const result = await service.editPositionID("111100001111","333344443333")
         expect(result.status).toEqual(
            503
         )
      })
   })

   describe("get positions", () => {
      test('get positions', async () => {
         const result = await service.getPositions()
         expect(result.body).toEqual(
            [{
                "positionID":"800234543412",
                "aisleID": "8002",
                "row": "3454",
                "col": "3412",
                "maxWeight": 1000,
                "maxVolume": 1000,
                "occupiedWeight": 300,
                "occupiedVolume":150
            },{
                "positionID":"801234543412",
                "aisleID": "8012",
                "row": "3454",
                "col": "3412",
                "maxWeight": 1000,
                "maxVolume": 1000,
                "occupiedWeight": 300,
                "occupiedVolume":150
            }]
         )
      })
   })

   describe("create positions", () => {
      test('create a position', async () => {
         const result = await service.createPosition()
         expect(result.status).toEqual(
            201
         )
      })
   })
})