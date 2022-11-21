'use strict'

class RestockOrderService {
   constructor(dao) {
      this.dao = dao
   }

   getRestockOrders = async (status = undefined) => {
      try {
         const orders = await this.dao.getRestockOrders(status)
         const body = await Promise.all(
            orders.map(async (order) => {
               const note = await this.dao.getRestockOrdersNote(order.id)
               const products = await this.dao.getRestockOrdersProducts(
                  order.id
               )
               const skuItems = await this.dao.getRestockOrdersSkuItems(
                  order.id
               )
               return {
                  id: parseInt(order.id),
                  issueDate: order.issueDate,
                  state: order.state,
                  products: products.map((p) => ({
                     SKUId: p.Id,
                     itemId: p.id,
                     description: p.description,
                     price: p.price,
                     qty: p.Quantity,
                  })),
                  supplierId: order.supplierID,
                  transportNote: note !== undefined ? JSON.parse(note.Note) : undefined,
                  skuItems: skuItems.map((i) => ({
                     SKUId: i.SKUId,
                     rfid: i.RFID,
                  })),
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

   getRestockOrder = async (id) => {
      try {
         const order = await this.dao.getRestockOrder(id)
         if (order === undefined) {
            return {
               ok: false,
               status: 404,
            }
         }
         const note = await this.dao.getRestockOrdersNote(id)
         const products = await this.dao.getRestockOrdersProducts(id)
         const skuItems = await this.dao.getRestockOrdersSkuItems(id)
         return {
            ok: true,
            status: 200,
            body: {
               id: parseInt(order.id),
               issueDate: order.issueDate,
               state: order.state,
               products: products.map((p) => ({
                  SKUId: p.Id,
                  itemId: p.id,
                  description: p.description,
                  price: p.price,
                  qty: p.Quantity,
               })),
               supplierId: order.supplierID,
               transportNote: note !== undefined ? JSON.parse(note.Note) : undefined,
               skuItems: skuItems.map((i) => ({
                  SKUId: i.SKUId,
                  rfid: i.RFID,
               })),
            },
         }
      } catch (e) {
         return {
            ok: false,
            status: 500,
         }
      }
   }

   getReturnItems = async (id) => {
      try {
         const skuItems = await this.dao.getRestockOrdersSkuItems(id)
         return {
            ok: true,
            status: 200,
            body: skuItems.map((i) => ({
               SKUId: i.SKUId,
               rfid: i.RFID,
            })),
         }
      } catch (e) {
         return {
            ok: false,
            status: 500,
         }
      }
   }

   createRestockOrder = async (body) => {
      try {
         const order = {
            issueDate: body.issueDate,
            state: 'ISSUED',
            supplierID: body.supplierId,
         }
         const res1 = await this.dao.createRestockOrder(order)
         const res2 = await this.dao.createRestockOrderProducts(
            body.products.map((product) => ({
               RO_id: res1.id,
               SKUId: product.SKUId,
               Quantity: product.qty,
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
               status: 422,
            }
         }
         return {
            ok: false,
            status: 503,
         }
      }
   }

   setRestockOrderState = async (id, body) => {
      try {
         const res = await this.dao.setRestockOrderState(id, body.newState)
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
            status: 503,
         }
      }
   }

   addSkuItems = async (id, body) => {
      try {
         const res = await this.dao.createRestockOrderSkuItems(
            body.skuItems.map((skuItem) => ({
               RO_id: parseInt(id),
               SKUId: skuItem.SKUId,
               RFID: skuItem.rfid,
            }))
         )
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
               status: 404,
            }
         }
         return {
            ok: false,
            status: 503,
         }
      }
   }

   addTransportNote = async (id, body) => {
      try {
         const order = await this.dao.getRestockOrder(id)
         if (order === undefined) {
            return {
               ok: false,
               status: 404,
            }
         }
         const issueDate = new Date(order.issueDate)
         const deliveryDate = new Date(body.transportNote.deliveryDate)
         if (order.state !== 'DELIVERY' || issueDate > deliveryDate) {
            return {
               ok: false,
               status: 422,
            }
         }
         await this.dao.addTransportNote({
            id: id,
            Note: JSON.stringify(body.transportNote),
         })
         return {
            ok: true,
            status: 200,
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
            status: 503,
         }
      }
   }

   deleteRestockOrder = async (id) => {
      try {
         await this.dao.deleteRestockOrder(id)
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

module.exports = RestockOrderService
