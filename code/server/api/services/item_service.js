'use strict'

class ItemService {
   constructor(dao) {
      this.dao = dao
   }

   getItems = async () => {
      //401 not logged in / wrong permission
      //500 internal server error

      try {
         const items = await this.dao.getItems()
         return {
            ok: true,
            status: 200,
            body: items.map((item) => ({
               id: parseInt(item.id),
               description: item.description,
               price: parseFloat(item.price),
               SKUId: parseInt(item.SKU_Id),
               supplierId: parseInt(item.supplier_Id),
            })),
         }
      } catch (e) {
         return {
            ok: false,
            status: 500,
         }
      }
   }

   getItem = async (id, supplierID) => {
      //401 not logged in / wrong permission
      //404 no item associated to id
      //422 validation of id failed
      //500 internal server error

      if (isNaN(id)) {
         return {
            ok: false,
            status: 422,
         }
      }
      try {
         const item = await this.dao.getItem(id, supplierID)
         if (item === undefined) {
            return {
               ok: false,
               status: 404,
            }
         }
         return {
            ok: true,
            status: 200,
            body: {
               id: parseInt(item.id),
               description: item.description,
               price: parseFloat(item.price),
               SKUId: parseInt(item.SKU_Id),
               supplierId: parseInt(item.supplier_Id),
            },
         }
      } catch (e) {
         return {
            ok: false,
            status: 500,
         }
      }
   }

   createItem = async (body) => {
      //401 not logged in / wrong permission
      //404 sku not found
      //422 validation of body failed or supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID
      //503 internal server error

      if (Object.keys(body).length === 0) {
         return {
            ok: false,
            status: 422,
         }
      }
      const item = {
         id: parseInt(body.id),
         description: String(body.description),
         price: parseFloat(body.price),
         SKU_Id: parseInt(body.SKUId),
         supplier_Id: parseInt(body.supplierId),
      }
      try {
         const res = await this.dao.createItem(item)
         if (res.changes > 0) {
            return {
               ok: true,
               status: 201,
            }
         } else {
            return {
               ok: false,
               status: 404,
            }
         }
      } catch (e) {
         //check supplier already sells / not exists 422
         //check sku not exists 404
         if (e.code === 'SQLITE_CONSTRAINT') {
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

   updateItem = async (id, body, supplierID) => {
      //401 not logged in / wrong permission
      //422 validation of id failed
      //404 item not found
      //503 internal server error

      if (isNaN(id) || Object.keys(body).length === 0) {
         return {
            ok: false,
            status: 422,
         }
      }
      try {
         const tmp = await this.dao.getItem(id, supplierID)
         if (tmp !== undefined) {
            const item = {
               description:
                  body.newDescription !== undefined
                     ? String(body.newDescription)
                     : tmp.description,
               price:
                  body.newPrice !== undefined
                     ? parseFloat(body.newPrice)
                     : tmp.price,
            }
            await this.dao.updateItem(tmp.id, item, supplierID)
            return {
               ok: true,
               status: 200,
            }
         } else {
            return {
               ok: false,
               status: 404,
            }
         }
      } catch (e) {
         return {
            ok: false,
            status: 503,
         }
      }
   }

   deleteItem = async (id, supplierID) => {
      //401 not logged in / wrong permission
      //422 validation of id failed
      //404 item not found
      //503 service unavailable

      try {
         await this.dao.deleteItem(id, supplierID)
         return {
            ok: true,
            status: 204,
         }
      } catch (e) {
         return {
            ok: false,
            status: 503,
         }
      }
   }
}

module.exports = ItemService
