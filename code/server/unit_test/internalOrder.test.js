const InternalOrderService = require('../api/services/internalOrder_service')
const InternalOrderDao = require('../api/modules/mock/mock_internalOrder_dao')

const service = new InternalOrderService(InternalOrderDao)

// all test ok
describe('Testing internalOrder_service SUCCESS', () => {
   beforeAll(() => {
      // getInternalOrders
      InternalOrderDao.getInternalOrders.mockReset()
      InternalOrderDao.getInternalOrders.mockReturnValue([
         {
            id: 1,
            issueDate: '2022/05/24',
            state: 'ACCEPTED',
            customerID: 1,
         },
         {
            id: 2,
            issueDate: '2022/05/25',
            state: 'COMPLETED',
            customerID: 2,
         },
      ])

      // getInternalOrdersRows
      InternalOrderDao.getInternalOrdersRows.mockReset()
      InternalOrderDao.getInternalOrdersRows
         .mockReturnValueOnce([
            {
               Id: 1,
               description: 'item description #1',
               price: 10.99,
               Quantity: 3,
            },
            {
               Id: 3,
               description: 'item description #3',
               price: 40.99,
               Quantity: 2,
            },
         ])
         .mockReturnValueOnce([
            {
               Id: 5,
               description: 'item description #5',
               price: 10.59,
               Quantity: 5,
               RFID: '53AG34ATGG34YAH54',
            },
            {
               Id: 8,
               description: 'item description #8',
               price: 13.99,
               Quantity: 1,
               RFID: '3VTVW34TWV34Y4H56',
            },
         ])

      // createInternalOrder
      InternalOrderDao.createInternalOrder.mockReset()
      InternalOrderDao.createInternalOrder.mockReturnValueOnce({
         id: 1,
         changes: 1,
      })

      // createInternalOrderRows
      InternalOrderDao.createInternalOrderRows.mockReset()
      InternalOrderDao.createInternalOrderRows
         .mockReturnValueOnce({
            id: 3,
            changes: 1,
         })
         .mockReturnValueOnce({
            id: 4,
            changes: 1,
         })

      // deleteInternalOrder
      InternalOrderDao.deleteInternalOrder.mockReset()
      InternalOrderDao.deleteInternalOrder.mockReturnValueOnce({
         id: 1,
         changes: 1,
      })
   })

   test('getInternalOrders + getInternalOrdersRows', async () => {
      const result = await service.getInternalOrders()
      expect(result.body).toEqual([
         {
            id: 1,
            issueDate: '2022/05/24',
            state: 'ACCEPTED',
            products: [
               {
                  SKUId: 1,
                  description: 'item description #1',
                  price: 10.99,
                  qty: 3,
               },
               {
                  SKUId: 3,
                  description: 'item description #3',
                  price: 40.99,
                  qty: 2,
               },
            ],
            customerId: 1,
         },
         {
            id: 2,
            issueDate: '2022/05/25',
            state: 'COMPLETED',
            products: [
               {
                  SKUId: 5,
                  description: 'item description #5',
                  price: 10.59,
                  qty: 5,
                  RFID: '53AG34ATGG34YAH54',
               },
               {
                  SKUId: 8,
                  description: 'item description #8',
                  price: 13.99,
                  qty: 1,
                  RFID: '3VTVW34TWV34Y4H56',
               },
            ],
            customerId: 2,
         },
      ])
   })

   test('createInternalOrder + createInternalOrderRows', async () => {
      const result = await service.createInternalOrder({
         issueDate: '2022/05/24',
         products: [
            {
               SKU_Id: 1,
               description: 'item description #1',
               price: 10.99,
               Quantity: 3,
            },
            {
               SKU_Id: 3,
               description: 'item description #3',
               price: 40.99,
               Quantity: 23,
            },
         ],
         CustomerID: 1,
      })
      expect(result.status).toEqual(201)
   })

   test('deleteInternalOrder', async () => {
      const result = await service.deleteInternalOrder(1)
      expect(result.status).toEqual(204)
   })
})

// all test no
describe('Testing internalOrder_service FAIL', () => {
   beforeAll(() => {
      // getInternalOrders
      InternalOrderDao.getInternalOrder.mockReset()
      InternalOrderDao.getInternalOrder.mockReturnValue({
         id: 2,
         issueDate: '2022/05/24',
         state: 'COMPLETED',
         customerID: 4,
      })

      // getInternalOrdersRows
      InternalOrderDao.getInternalOrdersRows.mockReset()
      InternalOrderDao.getInternalOrdersRows.mockReturnValueOnce()

      // createInternalOrder
      InternalOrderDao.createInternalOrder.mockReset()
      InternalOrderDao.createInternalOrder.mockReturnValueOnce({
         id: 1,
         changes: 1,
      })

      // createInternalOrderRows
      InternalOrderDao.createInternalOrderRows.mockReset()
      InternalOrderDao.createInternalOrderRows
         .mockReturnValueOnce({
            id: 3,
            changes: 1,
         })
         .mockReturnValueOnce({
            id: 4,
            changes: 1,
         })

      // deleteInternalOrder
      InternalOrderDao.deleteInternalOrder.mockReset()
      InternalOrderDao.deleteInternalOrder.mockReturnValueOnce('error')
   })

   test('getInternalOrders + getInternalOrdersRows', async () => {
      const result = await service.getInternalOrders()
      expect(result.status).toEqual(500)
   })

   test('createInternalOrder + createInternalOrderRows', async () => {
      const result = await service.createInternalOrder({})
      expect(result.status).toEqual(422)
   })

   test('deleteInternalOrder', async () => {
      const result = await service.deleteInternalOrder(1)
      expect(result.status).toEqual(404)
   })
})

describe('Testing returnOrder_service BRANCHES', () => {
   beforeAll(() => {
      InternalOrderDao.setInternalOrderState.mockReset()
      InternalOrderDao.setInternalOrderState.mockReturnValue({
         id: 1,
         changes: 1,
      })

      InternalOrderDao.setInternalOrderState.mockReset()
      InternalOrderDao.setInternalOrderState.mockReturnValue({
         id: 1,
         changes: 0,
      })
   })

   test('setInternalOrderState', async () => {
      const result = await service.setInternalOrderState(1, {})
      expect(result.status).toEqual(422)
   })

   test('setInternalOrderState', async () => {
      const result = await service.setInternalOrderState(1, {
         newState: 'COMPLETED',
      })
      expect(result.status).toEqual(404)
   })
})

describe('Testing returnOrder_service BRANCHES', () => {
   beforeAll(() => {
      // getInternalOrders
      InternalOrderDao.getInternalOrder.mockReset()
      InternalOrderDao.getInternalOrder.mockReturnValue({
         id: 1,
         issueDate: '2022/05/24',
         state: 'ACCEPTED',
         customerID: 1,
      })

      // getInternalOrdersRows
      InternalOrderDao.getInternalOrdersRows.mockReset()
      InternalOrderDao.getInternalOrdersRows.mockReturnValueOnce([
         {
            Id: 1,
            description: 'item description #1',
            price: 10.99,
            Quantity: 3,
         },
         {
            Id: 3,
            description: 'item description #3',
            price: 40.99,
            Quantity: 2,
         },
      ])
   })

   test('getInternalOrders + getInternalOrdersRows', async () => {
      const result = await service.getInternalOrder(1)
      expect(result.body).toEqual({
         id: 1,
         issueDate: '2022/05/24',
         state: 'ACCEPTED',
         products: [
            {
               SKUId: 1,
               description: 'item description #1',
               price: 10.99,
               qty: 3,
            },
            {
               SKUId: 3,
               description: 'item description #3',
               price: 40.99,
               qty: 2,
            },
         ],
         customerId: 1,
      })
   })
})

describe('Testing returnOrder_service BRANCHES', () => {
   beforeAll(() => {
      InternalOrderDao.setInternalOrderState.mockReset()
      InternalOrderDao.setInternalOrderState.mockRejectedValue({
         code: 'SQLITE_CONSTRAINT'
      })
   })

   test('setInternalOrderState', async () => {
      const result = await service.setInternalOrderState(1, {
         newState: "COMPLETED"
      })
      expect(result.status).toEqual(422)
   })
})