const SkuService = require('../api/services/sku_service')
const SkuDao = require('../api/modules/mock/mock_sku_dao')

const service = new SkuService(SkuDao)

describe("test skus", () => {
   beforeAll(() => {
      SkuDao.getSKUs.mockReset()
      SkuDao.editSKUPosition.mockReset()
      SkuDao.getSKUs.mockResolvedValue(
        [
            {
                "id":1,
                "description" : "a new sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "positionID" : "800234523412",
                "availableQuantity" : 50,
                "price" : 10.99,
                "testDescriptors" : [1,3,4]
            },
            {
                "id":2,
                "description" : "another sku",
                "weight" : 101,
                "volume" : 60,
                "notes" : "second SKU",
                "positionID" : "800234543412",
                "availableQuantity" : 55,
                "price" : 10.99,
                "testDescriptors" : [2,5,7]
            },
        ])
      SkuDao.editSKUPosition.mockRejectedValueOnce('exceeded').mockRejectedValue('id not found');
      SkuDao.deleteSKU.mockRejectedValue('id not found');
      SkuDao.getSKUsById.mockResolvedValue({
         "id":1,
         "description" : "a new sku",
         "weight" : 100,
         "volume" : 50,
         "notes" : "first SKU",
         "positionID" : "800234523412",
         "availableQuantity" : 50,
         "price" : 10.99,
         "testDescriptors" : [1,3,4]
     })
     SkuDao.editSKU.mockRejectedValueOnce("id not found").mockResolvedValueOnce(true).mockRejectedValueOnce("error");
     SkuDao.createSKU.mockRejectedValueOnce("error");
   })

   describe("delete skus", () => {
      test('delete a sku inexistent', async () => {
         const result = await service.deleteSku()
         expect(result.status).toEqual(
            404
         )
      })
   })

   describe("create skus", () => {
      test('create a sku generic error', async () => {
         const result = await service.createSku()
         expect(result.status).toEqual(
            503
         )
      })
   })

   describe("get skus by id", () => {
      test('get skus by id', async () => {
         const result = await service.getSKUsById(1)
         expect(result.body).toEqual({
            "id":1,
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "position" : "800234523412",
            "availableQuantity" : 50,
            "price" : 10.99,
            "testDescriptors" : [1,3,4]
        })
      })
   })

   describe("get skus", () => {
      test('get skus', async () => {
         const result = await service.getSKUs()
         expect(result.body).toEqual(
            [{
                "id":1,
                "description" : "a new sku",
                "weight" : 100,
                "volume" : 50,
                "notes" : "first SKU",
                "position" : "800234523412",
                "availableQuantity" : 50,
                "price" : 10.99,
                "testDescriptors" : [1,3,4]
            },
            {
                "id":2,
                "description" : "another sku",
                "weight" : 101,
                "volume" : 60,
                "notes" : "second SKU",
                "position" : "800234543412",
                "availableQuantity" : 55,
                "price" : 10.99,
                "testDescriptors" : [2,5,7]
            }]
         )
      })
   })

   describe("edit sku", () => {
      test('editing sku with invalid id', async () => {
         const result = await service.editSku(1)
         expect(result.status).toEqual(
            404
         )
      })
      test('editing sku successful', async () => {
         const result = await service.editSku(2)
         expect(result.status).toEqual(
            200
         )
      })
      test('editing sku generic error', async () => {
         const result = await service.editSku(3)
         expect(result.status).toEqual(
            503
         )
      })
   })

   describe("edit sku position", () => {
      test('position has no space', async () => {
         const result = await service.editSkuPosition()
         expect(result.status).toEqual(
            422
         )
         const result1 = await service.editSkuPosition()
         expect(result1.status).toEqual(
           404
        )
      })
   })
})