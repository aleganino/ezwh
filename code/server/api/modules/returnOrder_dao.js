'use strict'
const sqlite = require('sqlite3')
const dbPath = require('../../server').databasePath

const db = new sqlite.Database(dbPath, (err) => {
   if (err) throw err
   db.run('PRAGMA foreign_keys = ON')
})

exports.getReturnOrders = () => {
   return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM Return_Order'
      db.all(sql, (err, rows) => {
         if (err) return reject(err)
         return resolve(rows)
      })
   })
}

exports.getReturnOrdersRows = (id) => {
   return new Promise((resolve, reject) => {
      const sql = `
         SELECT SKU.Id, SKU.description, SKU.price, SKU_Item.RFID
         FROM SKU
         JOIN SKU_Item ON SKU.Id = SKU_Item.SKU_Id
         JOIN Item ON Item.id = SKU.Id
         WHERE SKU.Id IN (
               SELECT SKUId
               FROM RN_Product
               WHERE RN_id = ?
            )
         GROUP BY SKU.Id`
      db.all(sql, [id], (err, rows) => {
         if (err) return reject(err)
         return resolve(rows)
      })
   })
}

exports.getReturnOrder = (id) => {
   return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM Return_Order WHERE id = ?'
      db.get(sql, [id], (err, rows) => {
         if (err) return reject(err)
         return resolve(rows)
      })
   })
}

exports.createReturnOrder = (returnOrder) => {
   return new Promise((resolve, reject) => {
      const sql =
         'INSERT INTO Return_Order (returnDate, restockOrderId) VALUES (?, ?)'
      db.run(
         sql,
         [returnOrder.returnDate, returnOrder.restockOrderId],
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

exports.createReturnOrderRows = (products) => {
   return new Promise((resolve, reject) => {
      products.forEach((row) => {
         const sql = 'INSERT INTO RN_Product (RN_id, SKUId) VALUES (?, ?)'
         db.run(sql, [row.RN_id, row.SKUId], function (err) {
            if (err) return reject(err)
            return resolve({
               id: this.lastID,
               changes: this.changes,
            })
         })
      })
   })
}

exports.deleteReturnOrder = (id) => {
   return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM Return_Order WHERE id = ?'
      db.run(sql, [id], function (err) {
         if (err) return reject(err)
         return resolve({
            id: this.lastID,
            changes: this.changes,
         })
      })
   })
}
