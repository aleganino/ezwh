'use strict'
const sqlite = require('sqlite3')
const dbPath = require('../../server').databasePath

const db = new sqlite.Database(dbPath, (err) => {
   if (err) throw err
   db.run('PRAGMA foreign_keys = ON')
})

exports.getSuppliers = () => {
   return new Promise((resolve, reject) => {
      const sql = `
         SELECT id, name, surname, username
         FROM User
         WHERE type = 'supplier'
      `
      db.all(sql, (err, rows) => {
         if (err) return reject(err)
         return resolve(rows)
      })
   })
}

exports.getUsers = () => {
   return new Promise((resolve, reject) => {
      const sql = `
         SELECT id, name, surname, username, type
         FROM User
         WHERE type != 'manager'
      `
      db.all(sql, (err, rows) => {
         if (err) return reject(err)
         return resolve(rows)
      })
   })
}

exports.createUser = (user) => {
   return new Promise((resolve, reject) => {
      const sql =
         'INSERT INTO User (username, name, surname, password, type) VALUES (?, ?, ?, ?, ?)'
      db.run(
         sql,
         [user.username, user.name, user.surname, user.password, user.type],
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

exports.createSupplier = (username, user, id) => {
   return new Promise((resolve, reject) => {
      const sql =
         'INSERT INTO Supplier (id, user, name) VALUES (?, ?, ?)'
      db.run(
         sql,
         [id, username, user],
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

exports.authUser = (auth) => {
   return new Promise((resolve, reject) => {
      const sql =
         'SELECT id, username, name FROM User WHERE username = ? AND password = ? AND type = ?'
      db.get(sql, [auth.username, auth.password, auth.type], (err, row) => {
         if (err) return reject(err)
         return resolve(row)
      })
   })
}

exports.updateUser = (user) => {
   return new Promise((resolve, reject) => {
      const sql = 'UPDATE User SET type = ? WHERE username = ? AND type = ?'
      db.run(sql, [user.new, user.username, user.old], function (err) {
         if (err) return reject(err)
         return resolve({
            id: this.lastID,
            changes: this.changes,
         })
      })
   })
}

exports.deleteUser = (user) => {
   return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM User WHERE username = ? AND type = ?'
      db.run(sql, [user.username, user.type], function (err) {
         if (err) return reject(err)
         return resolve({
            id: this.lastID,
            changes: this.changes,
         })
      })
   })
}
