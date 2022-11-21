'use strict'
const sqlite = require('sqlite3')
const dbPath = require('../../server').databasePath

const db = new sqlite.Database(dbPath, (err) => {
   if (err) throw err
   db.run("PRAGMA foreign_keys = ON")
})

exports.getInternalOrders = (state) => {
   return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Internal_Order ${
         state !== undefined ? `WHERE state = '${state}'` : ''
      }`
      db.all(sql, (err, rows) => {
         if (err) return reject(err)
         return resolve(rows)
      })
   })
}

exports.getInternalOrdersRows = (id, state) => {
   return new Promise((resolve, reject) => {
      const sql =
         state === 'COMPLETED'? `
         SELECT SKU.Id, SKU.description, SKU.price, SKU_Item.RFID
         FROM SKU
         JOIN SKU_Item ON SKU_Item.SKU_Id = SKU.Id
         JOIN IN_Product ON SKU.Id = IN_Product.SKUId
         WHERE SKU.Id IN (
               SELECT SKUId
               FROM IN_Product
               WHERE IN_id = ?
            )
         GROUP BY SKU.Id
         ` : `
         SELECT SKU.Id, SKU.description, SKU.price, IN_Product.Quantity
         FROM SKU
         JOIN IN_Product ON SKU.Id = IN_Product.SKUId
         WHERE SKU.Id IN (
               SELECT SKUId
               FROM IN_Product
               WHERE IN_id = ?
            )
         GROUP BY SKU.Id
         `
      db.all(sql, [id], (err, rows) => {
         if (err) return reject(err)
         return resolve(rows)
      })
   })
}

exports.getInternalOrder = (id) => {
   return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM Internal_Order WHERE id = ?'
      db.get(sql, [id], (err, row) => {
         if (err) return reject(err)
         return resolve(row)
      })
   })
}

exports.createInternalOrder = (internalOrder) => {
   return new Promise((resolve, reject) => {
      const sql =
         'INSERT INTO Internal_Order (issueDate, state, customerID) VALUES (?, ?, ?)'
      db.run(
         sql,
         [
            internalOrder.issueDate,
            internalOrder.state,
            internalOrder.customerID,
         ],
         function (err) {
            if (err) return reject(err)
            return resolve({
               id: this.lastID,
               changes: this.changes,
            })
         }
      )
   })
}

exports.createInternalOrderRows = (products) => {
   return new Promise((resolve, reject) => {
      products.forEach((row) => {
         const sql =
            'INSERT INTO IN_Product (IN_id, SKUId, Quantity) VALUES (?, ?, ?)'
         db.run(sql, [row.IN_id, row.SKUId, row.Quantity], function (err) {
            if (err) return reject(err)
            return resolve({
               id: this.lastID,
               changes: this.changes,
            })
         })
      })
   })
}

exports.setInternalOrderState = (id, state) => {
   return new Promise((resolve, reject) => {
      const sql = 'UPDATE Internal_Order SET state = ? WHERE id = ?'
      db.run(sql, [state, id], function (err) {
         if (err) return reject(err)
         return resolve({
            id: this.lastID,
            changes: this.changes,
         })
      })
   })
}

exports.deleteInternalOrder = (id) => {
   return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM Internal_Order WHERE id = ?'
      db.run(sql, [id], function (err) {
         if (err) return reject(err)
         return resolve({
            id: this.lastID,
            changes: this.changes,
         })
      })
   })
}
