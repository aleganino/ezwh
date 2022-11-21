'use strict'

class ReturnOrderService {
   constructor(dao) {
      this.dao = dao
   }

   getReturnOrders = async () => {
      //401 not logged in / wrong permission
      //500 internal server error

      try {
         const orders = await this.dao.getReturnOrders()
         const body = await Promise.all(
            orders.map(async (order) => {
               const products = await this.dao.getReturnOrdersRows(order.id)
               return {
                  id: parseInt(order.id),
                  returnDate: order.returnDate,
                  products: products.map((p) => ({
                     SKUId: p.Id,
                     itemId: p.id,
                     description: p.description,
                     price: p.price,
                     RFID: p.RFID,
                  })),
                  restockOrderId: parseInt(order.restockOrderId),
               }
            })
         )
         return {
            ok: true,
            status: 200,
            body: body,
         }
      } catch (e) {
         return {
            ok: false,
            status: 500,
         }
      }
   }

   getReturnOrder = async (id) => {
      //401 not logged in / wrong permission
      //422 validation of id failed
      //404 not found
      //500 internal server error

      if (isNaN(id)) {
         return {
            ok: false,
            status: 422,
         }
      }
      try {
         const order = await this.dao.getReturnOrder(id)
         if (order === undefined) {
            return {
               ok: false,
               status: 404,
            }
         }
         const products = await this.dao.getReturnOrdersRows(order.id)
         return {
            ok: true,
            status: 200,
            body: {
               id: parseInt(order.id),
               returnDate: order.returnDate,
               state: order.state,
               products: products.map((p) => ({
                  SKUId: p.Id,
                  itemId: p.id,
                  description: p.description,
                  price: p.price,
                  RFID: p.RFID,
               })),
               restockOrderId: parseInt(order.restockOrderId),
            },
         }
      } catch (e) {
         return {
            ok: false,
            status: 500,
         }
      }
   }

   createReturnOrder = async (body) => {
      //401 not logged in / wrong permission
      //422 validation of id failed
      //500 internal server error

      if (Object.keys(body).length === 0) {
         return {
            ok: false,
            status: 422,
         }
      }
      const order = {
         returnDate: String(body.returnDate),
         restockOrderId: parseInt(body.restockOrderId),
      }
      try {
         const res1 = await this.dao.createReturnOrder(order)
         const res2 = await this.dao.createReturnOrderRows(
            body.products.map((product) => ({
               RN_id: parseInt(res1.id),
               SKUId: parseInt(product.SKUId),
            }))
         )
         return {
            ok: true,
            status: 201,
         }
      } catch (e) {
         if (e.code === 'SQLITE_CONSTRAINT') {
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

   deleteReturnOrder = async (id) => {
      //401 not logged in / wrong permission
      //422 validation of id failed
      //404 returnOrder not found
      //503 service unavailable

      try {
         await this.dao.deleteReturnOrder(id)
         return {
            ok: true,
            status: 204,
         }
      } catch (e) {
         return {
            ok: false,
            status: 500,
         }
      }
   }
}

module.exports = ReturnOrderService
