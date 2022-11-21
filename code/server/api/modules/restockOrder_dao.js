'use strict'
const sqlite = require('sqlite3')
const dbPath = require('../../server').databasePath

const db = new sqlite.Database(dbPath, (err) => {
   if (err) throw err
   db.run('PRAGMA foreign_keys = ON')
})

exports.getRestockOrders = (state = undefined) => {
   return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Restock_Order ${
         state !== undefined ? `WHERE state = '${state}'` : ''
      }`
      db.all(sql, (err, rows) => {
         if (err) return reject(err)
         return resolve(rows)
      })
   })
}

exports.getRestockOrder = (id) => {
   return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Restock_Order WHERE id = ?`
      db.get(sql, [id], (err, row) => {
         if (err) return reject(err)
         return resolve(row)
      })
   })
}

exports.getRestockOrdersProducts = (id) => {
   return new Promise((resolve, reject) => {
      const sql = `
         SELECT SKU.Id, Item.id, SKU.description, SKU.price, RO_Product.Quantity
         FROM SKU
         JOIN RO_Product ON SKU.Id = RO_Product.SKUId
         JOIN Item ON Item.SKU_Id=SKU.Id
         WHERE SKU.Id IN (
               SELECT SKUId
               FROM RO_Product
               WHERE RO_id = ?
            )
         GROUP BY SKU.Id
      `
      db.all(sql, [id], (err, rows) => {
         if (err) return reject(err)
         return resolve(rows)
      })
   })
}

exports.getRestockOrdersNote = (id) => {
   return new Promise((resolve, reject) => {
      const sql = `SELECT Note FROM RO_Notes WHERE RO_id = ?`
      db.get(sql, [id], (err, row) => {
         if (err) return reject(err)
         return resolve(row)
      })
   })
}

exports.getRestockOrdersSkuItems = (id) => {
   return new Promise((resolve, reject) => {
      const sql = `SELECT SKUId, RFID FROM RO_skuitems WHERE RO_id = ?`
      db.all(sql, [id], (err, rows) => {
         if (err) return reject(err)
         return resolve(rows)
      })
   })
}

exports.createRestockOrder = (order) => {
   return new Promise((resolve, reject) => {
      const sql = `INSERT INTO Restock_Order (issueDate, state, supplierID) VALUES (?, ?, ?)`
      db.run(
         sql,
         [order.issueDate, order.state, order.supplierID],
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

exports.createRestockOrderProducts = (products) => {
   return new Promise((resolve, reject) => {
      products.forEach((row) => {
         const sql = `INSERT INTO RO_Product (RO_id, SKUId, Quantity) VALUES (?, ?, ?)`
         db.run(sql, [row.RO_id, row.SKUId, row.Quantity], function (err) {
            if (err) return reject(err)
            return resolve({
               id: this.lastID,
               changes: this.changes,
            })
         })
      })
   })
}

exports.setRestockOrderState = (id, state) => {
   return new Promise((resolve, reject) => {
      const sql = 'UPDATE Restock_Order SET state = ? WHERE id = ?'
      db.run(sql, [state, id], function (err) {
         if (err) return reject(err)
         return resolve({
            id: this.lastID,
            changes: this.changes,
         })
      })
   })
}

exports.createRestockOrderSkuItems = (skuItems) => {
   return new Promise((resolve, reject) => {
      skuItems.forEach((row) => {

         const sql = `INSERT INTO RO_skuitems (RO_id, RFID, SKUId) VALUES (?, ?, ?)`
         db.run(sql, [row.RO_id, row.RFID, row.SKUId], function (err) {
            if (err) return reject(err)
            return resolve({
               id: this.lastID,
               changes: this.changes,
            })
         })
      })
   })
}

exports.addTransportNote = (transportNote) => {
   return new Promise((resolve, reject) => {
      const sql = `INSERT INTO RO_Notes (RO_id, Note) VALUES (?, ?)`
      db.run(sql, [transportNote.id, transportNote.Note], function (err) {
         if (err) return reject(err)
         return resolve({
            id: this.lastID,
            changes: this.changes,
         })
      })
   })
}

exports.deleteRestockOrder = (id) => {
   return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM Restock_Order WHERE id = ?'
      db.run(sql, [id], function (err) {
         if (err) return reject(err)
         return resolve({
            id: this.lastID,
            changes: this.changes,
         })
      })
   })
}