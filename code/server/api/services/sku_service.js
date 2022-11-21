'use strict'

class SkuService {
   constructor(dao) {
      this.dao = dao
   }

   getSKUs = async () => {
      try {
         const skus = await this.dao.getSKUs()
         const skuDTO = skus.map((q) => ({
            id: q.id,
            description: q.description,
            weight: q.weight,
            volume: q.volume,
            notes: q.notes,
            position: q.positionID,
            availableQuantity: q.availableQuantity,
            price: q.price,
            testDescriptors: q.testDescriptors,
         }))
         return {
            ok: true,
            status: 200,
            body: skuDTO,
         }
      } catch (e) {
         return {
            ok: false,
            status: 500,
         }
      }
   }

   getSKUsById = async (id) => {
      try {
         const sku = await this.dao.getSKUsById(id)
         const message = {
            id: sku.id,
            description: sku.description,
            weight: sku.weight,
            volume: sku.volume,
            notes: sku.notes,
            position: sku.positionID,
            availableQuantity: sku.availableQuantity,
            price: sku.price,
            testDescriptors: sku.testDescriptors,
         }
         return {
            ok: true,
            status: 200,
            body: message,
         }
      } catch (e) {
         if (e === 'id not found') {
            return {
               ok: false,
               status: 404,
            }
         }
         return {
            ok: false,
            status: 500,
         }
      }
   }

   createSku = async (
      description,
      weight,
      volume,
      notes,
      price,
      availableQuantity,
      positionID
   ) => {
      try {
         const response = await this.dao.createSKU(
            description,
            weight,
            volume,
            notes,
            price,
            availableQuantity,
            positionID === null ? null : positionID
         )
         return {
            ok: true,
            status: 201,
         }
      } catch (e) {
         return {
            ok: false,
            status: 503,
         }
      }
   }

   editSku = async (
      id,
      description,
      weight,
      volume,
      notes,
      price,
      availableQuantity,
      positionID
   ) => {
      try {
         const response = await this.dao.editSKU(
            id,
            description,
            weight,
            volume,
            notes,
            price,
            availableQuantity,
            positionID === null ? null : positionID
         )
         return {
            ok: true,
            status: 200,
         }
      } catch (e) {
         if (e === 'id not found') {
            return {
               ok: false,
               status: 404,
            }
         }
         return {
            ok: false,
            status: 503,
         }
      }
   }

   editSkuPosition = async (id, positionID) => {
      try {
         const response = await this.dao.editSKUPosition(id, positionID)
         return {
            ok: true,
            status: 200,
         }
      } catch (e) {
         if (e === 'id not found') {
            return {
               ok: false,
               status: 404,
            }
         }
         if (e === 'exceeded' || e === 'assigned') {
            return {
               ok: false,
               status: 422,
            }
         }
         return {
            ok: false,
            status: 503,
         }
      }
   }

   deleteSku = async (id) => {
      try {
         const response = await this.dao.deleteSKU(id)
         return {
            ok: true,
            status: 204,
         }
      } catch (e) {
         if (e === 'id not found') {
            return {
               ok: false,
               status: 204,
            }
         }
         return {
            ok: false,
            status: 503,
         }
      }
   }
}

module.exports = SkuService
