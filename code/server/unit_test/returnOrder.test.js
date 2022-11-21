const ReturnOrderService = require('../api/services/returnOrder_service')
const ReturnOrderDao = require('../api/modules/mock/mock_returnOrder_dao')

const service = new ReturnOrderService(ReturnOrderDao)

// all test ok
describe('Testing returnOrder_service SUCCESS', () => {
   beforeAll(() => {
      // getReturnOrders
      ReturnOrderDao.getReturnOrders.mockReset()
      ReturnOrderDao.getReturnOrders.mockReturnValue([
         {
            id: 1,
            returnDate: '2022/05/24',
            restockOrderId: 1,
         },
         {
            id: 2,
            returnDate: '2022/05/25',
            restockOrderId: 2,
         },
      ])

      // getReturnOrdersRows
      ReturnOrderDao.getReturnOrdersRows.mockReset()
      ReturnOrderDao.getReturnOrdersRows
         .mockReturnValueOnce([
            {
               Id: 1,
               description: 'item description #1',
               price: 10.99,
               RFID: '03NISDAJ82HIJDSA',
            },
            {
               Id: 3,
               description: 'item description #3',
               price: 40.99,
               RFID: 'H877A98SGD7SGD97',
            },
         ])
         .mockReturnValueOnce([
            {
               Id: 5,
               description: 'item description #5',
               price: 10.59,
               RFID: '53AG34ATGG34YAH54',
            },
            {
               Id: 8,
               description: 'item description #8',
               price: 13.99,
               RFID: '3VTVW34TWV34Y4H56',
            },
         ])

      // createReturnOrder
      ReturnOrderDao.createReturnOrder.mockReset()
      ReturnOrderDao.createReturnOrder.mockReturnValueOnce({
         id: 1,
         changes: 1,
      })

      // createReturnOrderRows
      ReturnOrderDao.createReturnOrderRows.mockReset()
      ReturnOrderDao.createReturnOrderRows
         .mockReturnValueOnce({
            id: 3,
            changes: 1,
         })
         .mockReturnValueOnce({
            id: 4,
            changes: 1,
         })

      // deleteReturnOrder
      ReturnOrderDao.deleteReturnOrder.mockReset()
      ReturnOrderDao.deleteReturnOrder.mockReturnValueOnce({
         id: 1,
         changes: 1,
      })
   })

   test('getReturnOrders + getReturnOrdersRows', async () => {
      const result = await service.getReturnOrders()
      expect(result.body).toEqual([
         {
            id: 1,
            returnDate: '2022/05/24',
            products: [
               {
                  SKUId: 1,
                  description: 'item description #1',
                  price: 10.99,
                  RFID: '03NISDAJ82HIJDSA',
               },
               {
                  SKUId: 3,
                  description: 'item description #3',
                  price: 40.99,
                  RFID: 'H877A98SGD7SGD97',
               },
            ],
            restockOrderId: 1,
         },
         {
            id: 2,
            returnDate: '2022/05/25',
            products: [
               {
                  SKUId: 5,
                  description: 'item description #5',
                  price: 10.59,
                  RFID: '53AG34ATGG34YAH54',
               },
               {
                  SKUId: 8,
                  description: 'item description #8',
                  price: 13.99,
                  RFID: '3VTVW34TWV34Y4H56',
               },
            ],
            restockOrderId: 2,
         },
      ])
   })

   test('createReturnOrder + createReturnOrderRows', async () => {
      const result = await service.createReturnOrder({
         returnDate: '2022/05/24',
         products: [
            {
               SKUId: 1,
               description: 'item description #1',
               price: 10.99,
               RFID: '03NISDAJ82HIJDSA',
            },
            {
               SKUId: 3,
               description: 'item description #3',
               price: 40.99,
               RFID: 'H877A98SGD7SGD97',
            },
         ],
         restockOrderId: 1,
      })
      expect(result.status).toEqual(201)
   })

   test('deleteReturnOrder', async () => {
      const result = await service.deleteReturnOrder(1)
      expect(result.status).toEqual(204)
   })
})

// all test no
describe('Testing returnOrder_service FAIL', () => {
   beforeAll(() => {
      // getReturnOrder
      ReturnOrderDao.getReturnOrder.mockReset()
      ReturnOrderDao.getReturnOrder.mockReturnValue({
         id: 2,
         returnDate: '2022/05/23',
         restockOrderId: 3,
      })

      // getReturnOrdersRow
      ReturnOrderDao.getReturnOrdersRows.mockReset()
      ReturnOrderDao.getReturnOrdersRows.mockReturnValueOnce()

      // getReturnOrder
      ReturnOrderDao.getReturnOrder.mockReset()
      ReturnOrderDao.getReturnOrder.mockReturnValue(undefined)

      // createReturnOrder
      ReturnOrderDao.createReturnOrder.mockReset()
      ReturnOrderDao.createReturnOrder.mockReturnValueOnce({
         id: 1,
         changes: 1,
      })

      // createReturnOrderRows
      ReturnOrderDao.createReturnOrderRows.mockReset()
      ReturnOrderDao.createReturnOrderRows
         .mockReturnValueOnce({
            id: 3,
            changes: 1,
         })
         .mockReturnValueOnce({
            id: 4,
            changes: 1,
         })

         // createReturnOrder
      ReturnOrderDao.createReturnOrder.mockReset()
      ReturnOrderDao.createReturnOrder.mockReturnValueOnce({
         id: 1,
         changes: 1,
      })

      // createReturnOrderRows
      ReturnOrderDao.createReturnOrderRows.mockReset()
      ReturnOrderDao.createReturnOrderRows
         .mockReturnValueOnce({
            id: 3,
            changes: 1,
         })
         .mockReturnValueOnce({
            id: 4,
            changes: 1,
         })

      // deleteReturnOrder
      ReturnOrderDao.deleteReturnOrder.mockReset()
      ReturnOrderDao.deleteReturnOrder.mockRejectedValue("error")
   })

   test('getReturnOrder + getReturnOrdersRow', async () => {
      const result = await service.getReturnOrder(1)
      expect(result.status).toEqual(404)
   })

   test('getReturnOrder + getReturnOrdersRow', async () => {
      const result = await service.getReturnOrder(1)
      expect(result.status).toEqual(404)
   })

   test('createReturnOrder + createReturnOrderRows', async () => {
      const result = await service.createReturnOrder({})
      expect(result.status).toEqual(422)
   })

   test('createReturnOrder + createReturnOrderRows', async () => {
      const result = await service.createReturnOrder({
         returnDate: '2022/05/24',
         products: null,
         restockOrderId: 1,
      })
      expect(result.status).toEqual(500)
   })

   test('deleteReturnOrder', async () => {
      const result = await service.deleteReturnOrder(1)
      expect(result.status).toEqual(500)
   })
})

describe('Testing returnOrder_service BRANCH', () => {
   beforeAll(() => {
      // getReturnOrder
      ReturnOrderDao.getReturnOrder.mockReset()
      ReturnOrderDao.getReturnOrder.mockReturnValue({
         id: 2,
         returnDate: '2022/05/23',
         restockOrderId: 3,
      })

      // getReturnOrdersRow
      ReturnOrderDao.getReturnOrdersRows.mockReset()
      ReturnOrderDao.getReturnOrdersRows.mockReturnValueOnce([
         {
            SKU_Id: 1,
            description: 'item description #1',
            price: 10.99,
            RFID: '03NISDAJ82HIJDSA',
         },
         {
            SKU_Id: 3,
            description: 'item description #3',
            price: 40.99,
            RFID: 'H877A98SGD7SGD97',
         },
      ])
   })

   test('getReturnOrder + getReturnOrdersRow', async () => {
      const result = await service.getReturnOrder(1)
      expect(result.status).toEqual(200)
   })
})