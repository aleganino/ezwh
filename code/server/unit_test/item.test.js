const ItemService = require('../api/services/item_service')
const ItemDao = require('../api/modules/mock/mock_item_dao')

const service = new ItemService(ItemDao)

describe('Testing item_service SUCCESS', () => {
   beforeAll(() => {
      // getItems
      ItemDao.getItems.mockReset()
      ItemDao.getItems.mockReturnValue([
         {
            id: 1,
            description: 'item description #1',
            price: 10.99,
            SKU_Id: 3,
            supplier_Id: 2,
         },
         {
            id: 2,
            description: 'item description #2',
            price: 13.99,
            SKU_Id: 2,
            supplier_Id: 1,
         },
      ])

      // createItem
      ItemDao.createItem.mockReset()
      ItemDao.createItem.mockReturnValueOnce({
         id: 1,
         changes: 1,
      })

      // deleteItem
      ItemDao.deleteItem.mockReset()
      ItemDao.deleteItem.mockReturnValueOnce({
         id: 1,
         changes: 1,
      })
   })

   test('getItems', async () => {
      const result = await service.getItems()
      expect(result.body).toEqual([
         {
            id: 1,
            description: 'item description #1',
            price: 10.99,
            SKUId: 3,
            supplierId: 2,
         },
         {
            id: 2,
            description: 'item description #2',
            price: 13.99,
            SKUId: 2,
            supplierId: 1,
         },
      ])
   })

   test('createItem', async () => {
      const result = await service.createItem({
         id: 1,
         description: 'item description #1',
         price: 10.99,
         SKUId: 3,
         supplierId: 2,
      })
      expect(result.status).toEqual(201)
   })

   test('deleteItem', async () => {
      const result = await service.deleteItem(1)
      expect(result.status).toEqual(204)
   })
})

describe('Testing item_service ERROR', () => {
   beforeAll(() => {
      // getItems
      ItemDao.getItem.mockReset()
      ItemDao.getItem.mockReturnValue(null)

      // createItem
      ItemDao.createItem.mockReset()
      ItemDao.createItem.mockReturnValueOnce({
         id: 1,
         changes: 1,
      })

      // createItem
      ItemDao.createItem.mockReset()
      ItemDao.createItem.mockReturnValueOnce({
         id: 1,
         changes: 0,
      })

      // createItem
      ItemDao.createItem.mockReset()
      ItemDao.createItem.mockRejectedValue('error')

      // deleteItem
      ItemDao.deleteItem.mockReset()
      ItemDao.deleteItem.mockRejectedValue('error')

      // deleteItem
      ItemDao.deleteItem.mockReset()
      ItemDao.deleteItem.mockReturnValueOnce({
         id: 1,
         changes: 0,
      })
   })

   test('getItems', async () => {
      const result = await service.getItem(1)
      expect(result.status).toEqual(500)
   })

   test('createItem', async () => {
      const result = await service.createItem({})
      expect(result.status).toEqual(422)
   })

   test('createItem', async () => {
      const result = await service.createItem({})
      expect(result.status).toEqual(422)
   })

   test('createItem', async () => {
      const result = await service.createItem({
         id: 1,
         description: 'item description #1',
         price: 10.99,
         SKU_Id: 3,
         supplier_Id: 2,
      })
      expect(result.status).toEqual(503)
   })

   test('deleteItem', async () => {
      const result = await service.deleteItem(1)
      expect(result.status).toEqual(404)
   })

   test('deleteItem', async () => {
      const result = await service.deleteItem(1)
      expect(result.status).toEqual(500)
   })
})

describe('Testing item_service BRANCHES', () => {
   beforeAll(() => {
      ItemDao.updateItem.mockReset()
      ItemDao.updateItem.mockReturnValueOnce()
   })

   test('updateItem', async () => {
      const result = await service.updateItem({})
      expect(result.status).toEqual(422)
   })
})

describe('Testing item_service BRANCHES', () => {
   beforeAll(() => {
      ItemDao.getItem.mockReset()
      ItemDao.getItem.mockReturnValue(undefined)
   })

   test('updateItem', async () => {
      const result = await service.updateItem(1, {
         newDescription: '',
         newPrice: 10,
      })
      expect(result.status).toEqual(404)
   })
})

describe('Testing item_service BRANCHES', () => {
   beforeAll(() => {
      ItemDao.getItem.mockReset()
      ItemDao.getItem.mockRejectedValue("error")
   })

   test('updateItem', async () => {
      const result = await service.updateItem(1, {
         newDescription: '',
         newPrice: 10,
      })
      expect(result.status).toEqual(503)
   })
})
