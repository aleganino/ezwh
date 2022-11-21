'use strict'
const sqlite = require('sqlite3')
const dbPath = require('../../server').databasePath
const db = new sqlite.Database(dbPath, (err) => {
   if (err) throw err
   db.run("PRAGMA foreign_keys = ON")
})

function checkPresence(table, id) {
   const sql = `SELECT COUNT() AS isInTable FROM ${table} WHERE Id=${id};`
   return new Promise( (resolve,reject) => {
      db.all(sql, (err, rows) => {
         if (err) {
            reject(503)
         } else {
            const isInTable = rows.map((row) => row.isInTable).pop()
            if (!isInTable) {
               reject(404)
            }
            else {
            resolve()
            }
         }
      })
   })
}

exports.getTestDescriptors = async () => {
      const sql = 'SELECT * FROM Test_descriptor'
      return new Promise((resolve, reject) => {
         db.all(sql, (err, rows) => {
            if (err) {
               reject(err)
            } else {
               const result = Promise.all(
                  rows.map(async (row) => {
                     return {
                        id: row.id,
                        name: row.name,
                        procedureDescription: row.procedureDescription,
                        idSKU : row.SKU_Id
                     }
                  })
               )
               resolve(result)
            }
         })
      })
   }

exports.getTestDescriptorsId = async (id) => {
      const sql = `SELECT * FROM Test_descriptor WHERE id=${id};`
      return new Promise((resolve, reject) => {
         db.all(sql, (err, rows) => {
            if (err) {
               reject(err)
            } else {
               const result = Promise.all(
                  rows.map(async (row) => {
                     return {
                        id: row.id,
                        name: row.name,
                        procedureDescription: row.procedureDescription,
                        idSKU : row.SKU_Id
                     }
                  })
               )
               resolve(result)
            }
         })
      })
   }

exports.postTestDescriptor = async (name, procedureDescription, idSKU) => {
      const sql = 'SELECT MAX(id) AS maxId FROM Test_descriptor; '
      return new Promise((resolve, reject) => {
         checkPresence("SKU", idSKU).then ( () =>
            db.all(sql, (err, rows) => {
               if (err) {
                  reject(err)
               } else {
                  rows.map(
                     (row) =>
                        new Promise((resolve, reject) => {
                           const sql2 = `INSERT INTO Test_Descriptor (id, SKU_Id, name, procedureDescription) VALUES (${row.maxId + 1},${idSKU},"${name}","${procedureDescription}");`
                           db.all(sql2, (err, rows) => {
                              if (err) {
                                 reject(err.status)
                              } else {
                                 resolve(rows)
                              }
                           })
                        })
                  ).pop().then(
                     (result) => resolve(201),
                     (errorStatus) => reject(errorStatus)
                  )
               }
            }),
            (status) => resolve (status)
         )
      })
   }

exports.putTestDescriptorId = async (id, newName, newProcedureDescription, newIdSKU) => {
      const sql = `UPDATE Test_Descriptor SET name="${newName}", procedureDescription="${newProcedureDescription}", SKU_Id="${newIdSKU}" WHERE id = ${id};`
      return new Promise((resolve, reject) => {
         checkPresence("Test_Descriptor",id).then (() => {
            checkPresence("SKU", newIdSKU). then (() => {
               db.all(sql, (err, rows) => {
                  if (err) {
                     reject(err.status)
                  } else {
                     resolve(200)
                  }
               })
            },
            (status) => resolve (status)
            )
         },
         (status) => resolve (status)
         )
      })
   }

//The API.md document doesn't require error 404 but I think it makes more sense to implement it anyway
exports.deleteTestDescriptorId = async (id) => {
      const sql = `DELETE FROM Test_Descriptor where id=${id};`
      return new Promise((resolve, reject) => {
         checkPresence("Test_Descriptor", id). then (() => {
            db.all(sql, (err, rows) => {
               if (err) {
                  reject(err.status);
               } else {
                  resolve(204);
               }
            })
         },
         (status) => resolve(status)
         )
      })
   }
