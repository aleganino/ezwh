const SkuItemService = require('../api/services/sku_item_service')
const SkuItemDao = require('../api/modules/mock/mock_sku_item_dao')

const service = new SkuItemService(SkuItemDao)

describe("test skus", () => {
   beforeAll(() => {
      SkuItemDao.editSKUItem.mockReset();
        SkuItemDao.getSKUItemsByRfid.mockResolvedValue(
        {
            "RFID":"12345678901234567890123456789014",
            "SKUId":1,
            "Avaiable":0,
            "DateOfStock":"2021/11/29 12:30",
        })
        SkuItemDao.getSKUItemsById.mockResolvedValue(
            [{
                "RFID":"12345678901234567890123456789014",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            },
            {
                "RFID":"12345678901234567890123456789015",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            }])
      SkuItemDao.deleteSKUItem.mockResolvedValue(true);
      SkuItemDao.createSKUItem.mockResolvedValue(true);
      SkuItemDao.getSKUItems.mockRejectedValue("error");
      SkuItemDao.editSKUItem.mockRejectedValueOnce("error").mockRejectedValueOnce("id not found");
   })

   describe("delete sku items", () => {
      test('delete a sku item', async () => {
         const result = await service.deleteSkuItem()
         expect(result.status).toEqual(
            204
         )
      })
   })

   describe("get sku items", () => {
      test('get sku items generic error', async () => {
         const result = await service.getSkuItems()
         expect(result.status).toEqual(
            500
         )
      })
   })

   describe("edit sku items", () => {
      test('edit a sku item generic error', async () => {
         const result = await service.editSkuItem("1234","5555",1,null)
         expect(result.status).toEqual(
            503
         )
      })
      test('edit a sku item not found', async () => {
         const result = await service.editSkuItem("9999","5555",1,"19/7/1999")
         expect(result.status).toEqual(
            404
         )
      })
   })

   describe("create sku items", () => {
    test('create a sku item', async () => {
       const result = await service.createSkuItem()
       expect(result.status).toEqual(
          201
       )
    })
 })

   describe("get sku items", () => {
      test('get sku items by rfid', async () => {
         const result = await service.getSKUItemsByRfid(12345678901234567890123456789014)
         expect(result.body).toEqual(
            {
                "RFID":"12345678901234567890123456789014",
                "SKUId":1,
                "Available":0,
                "DateOfStock":"2021/11/29 12:30",
            })
      })
      test('get (available) sku items by skuID', async () => {
        const result = await service.getSKUItemsById(1)
        expect(result.body).toEqual(
            [{
                "RFID":"12345678901234567890123456789014",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            },
            {
                "RFID":"12345678901234567890123456789015",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            }])
     })
   })
})