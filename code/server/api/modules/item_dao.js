'use strict'
const sqlite = require('sqlite3')
const dbPath = require('../../server').databasePath

const db = new sqlite.Database(dbPath, (err) => {
   if (err) throw err
   db.run("PRAGMA foreign_keys = ON")
})

exports.getItems = () => {
   return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM item'
      db.all(sql, (err, rows) => {
         if (err) return reject(err)
         return resolve(rows)
      })
   })
}

exports.getItem = (id, supplierID) => {
   return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM item WHERE id = ? AND supplier_Id = ?'
      db.get(sql, [id, supplierID], (err, row) => {
         if (err) return reject(err)
         return resolve(row)
      })
   })
}

exports.createItem = (item) => {
   return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO item VALUES (?, ?, ?, ?, ?)'
      db.run(
         sql,
         [item.id, item.description, item.price, item.SKU_Id, item.supplier_Id],
         function (err) {
            if (err) return reject(err)
            return resolve({
               id: this.lastID,
               changes: this.changes
            })
         }
      )
   })
}

exports.updateItem = (id, item, supplierID) => {
   return new Promise((resolve, reject) => {
      const sql = 'UPDATE item SET description = ?, price = ? WHERE id = ? AND supplier_Id = ?'
      db.run(sql, [item.description, item.price, id, supplierID], function (err) {
         if (err) return reject(err)
         return resolve({
            id: this.lastID,
            changes: this.changes
         })
      })
   })
}

exports.deleteItem = (id, supplierID) => {
   return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM item WHERE id = ? AND supplier_Id = ?'
      db.run(sql, [id, supplierID], function (err) {
         if (err) return reject(err)
         return resolve({
            id: this.lastID,
            changes: this.changes
         })
      })
   })
}
