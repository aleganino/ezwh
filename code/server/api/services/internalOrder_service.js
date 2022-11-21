'use strict'

class InternalOrderService {
   constructor(dao) {
      this.dao = dao
   }

   getInternalOrders = async (state = undefined) => {
      //401 not logged in / wrong permission
      //422 validation of id failed
      //500 internal server error

      try {
         const orders = await this.dao.getInternalOrders(state)
         return {
            ok: true,
            status: 200,
            body: await Promise.all(
               orders.map(async (order) => {
                  const products = await this.dao.getInternalOrdersRows(
                     order.id,
                     order.state
                  )
                  return {
                     id: parseInt(order.id),
                     issueDate: order.issueDate,
                     state: order.state,
                     products: products.map((p) => {
                        return p.RFID !== undefined
                           ? {
                                SKUId: p.Id,
                                description: p.description,
                                price: p.price,
                                RFID: p.RFID,
                             }
                           : {
                                SKUId: p.Id,
                                description: p.description,
                                price: p.price,
                                qty: p.Quantity,
                             }
                     }),
                     customerId: parseInt(order.customerID),
                  }
               })
            ),
         }
      } catch (e) {
         return {
            ok: false,
            status: 500,
         }
      }
   }

   getInternalOrder = async (id) => {
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
         const order = await this.dao.getInternalOrder(id)
         if (order === undefined) {
            return {
               ok: false,
               status: 404,
            }
         }
         const products = await this.dao.getInternalOrdersRows(
            order.id,
            order.state
         )
         return {
            ok: true,
            status: 200,
            body: {
               id: parseInt(order.id),
               issueDate: order.issueDate,
               state: order.state,
               products: products.map((p) => {
                  return p.RFID !== undefined
                     ? {
                          SKUId: p.Id,
                          description: p.description,
                          price: p.price,
                          qty: p.Quantity,
                          RFID: p.RFID,
                       }
                     : {
                          SKUId: p.Id,
                          description: p.description,
                          price: p.price,
                          qty: p.Quantity,
                       }
               }),
               customerId: parseInt(order.customerID),
            },
         }
      } catch (e) {
         return {
            ok: false,
            status: 500,
         }
      }
   }

   createInternalOrder = async (body) => {
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
         issueDate: String(body.issueDate),
         state: 'ISSUED',
         customerID: parseInt(body.customerId),
      }
      try {
         const res1 = await this.dao.createInternalOrder(order)
         const res2 = await this.dao.createInternalOrderRows(
            body.products.map((product) => ({
               IN_id: parseInt(res1.id),
               SKUId: parseInt(product.SKUId),
               Quantity: parseInt(product.qty),
            }))
         )
         return {
            ok: true,
            status: 201,
         }
      } catch (e) {
         return {
            ok: false,
            status: 500,
         }
      }
   }

   setInternalOrderState = async (id, body) => {
      //401 not logged in / wrong permission
      //422 validation of id/body failed
      //404 item not found
      //503 service unavailable

      if (isNaN(id) || Object.keys(body).length === 0) {
         return {
            ok: false,
            status: 422,
         }
      }
      try {
         const res = await this.dao.setInternalOrderState(id, body.newState)
         if (res.changes > 0) {
            return {
               ok: true,
               status: 200,
            }
         } else {
            return {
               ok: true,
               status: 404,
            }
         }
      } catch (e) {
         if (e.code === 'SQLITE_CONSTRAINT') {
            return {
               ok: false,
               status: 422,
            }
         }
         return {
            ok: false,
            status: 500,
         }
      }
   }

   deleteInternalOrder = async (id) => {
      //401 not logged in / wrong permission
      //422 validation of id failed
      //404 internalOrder not found
      //503 service unavailable

      try {
         await this.dao.deleteInternalOrder(id)
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

module.exports = InternalOrderService
