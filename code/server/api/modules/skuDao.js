'use strict'
const sqlite = require('sqlite3')
const dbPath = require('../../server').databasePath
const db = new sqlite.Database(dbPath, (err) => {
   if (err) throw err
   db.run("PRAGMA foreign_keys = ON")
})

exports.getSKUs = () => {
   return new Promise((resolve, reject) => {
      const sql = 'SELECT * from SKU'
      db.all(sql, [], async (err, rows) => {
         if (err) {
            reject(err)
            return
         }
         const res = await Promise.all(
            rows.map(async (r) => {
               const descList = await this.getDescOfSku(r.Id)
               return {
                  id: r.Id,
                  description: r.description,
                  weight: r.weight,
                  volume: r.volume,
                  notes: r.notes,
                  positionID: r.positionID,
                  availableQuantity: r.avaiableQuantity,
                  price: r.price,
                  testDescriptors: descList,
               }
            })
         )
         resolve(res)
      })
   })
}

   exports.getSKUsById =async(id)=>{
      return new Promise((resolve, reject) => {
         const sql = 'SELECT * from SKU where Id=?'
         db.get(sql, [id], async (err, r) => {
            if (err) {
               reject(err)
               return
            }

            if (r === undefined) {
               reject('id not found')
               return
            }
            const descList = await this.getDescOfSku(id)
            const res = {
               id: r.Id,
               description: r.description,
               weight: r.weight,
               volume: r.volume,
               notes: r.notes,
               positionID: r.positionID,
               availableQuantity: r.avaiableQuantity,
               price: r.price,
               testDescriptors: descList,
            }
            resolve(res)
         })
      })
   }

   exports.createSKU=async(
      description,
      weight,
      volume,
      notes,
      price,
      availableQuantity,
      positionID
   )=> {
      return new Promise((resolve, reject) => {
         const sql =
            'INSERT INTO SKU (description, weight, volume, avaiableQuantity, price, notes, positionID) VALUES (?, ?, ?, ?, ?, ?, ?)'
         db.all(
            sql,
            [
               description,
               weight,
               volume,
               availableQuantity,
               price,
               notes,
               positionID,
            ],
            (err, rows) => {
               if (err) {
                  reject(err)
                  return
               }
               resolve(true)
            }
         )
      })
   }

   exports.editSKU=async(id, description, weight, volume, notes, price, availableQuantity)=> {
      return new Promise(async (resolve, reject) => {
         let check = this.idExists(id)
         await check.then((found) => {
            if (found === false) {
               reject('id not found')
               return
            }
         })
         let res = this.getPositionData(id)
         await res
            .then((r) => {
               if (
                  availableQuantity === r.oldQuantity &&
                  weight === r.oldWeight &&
                  volume === r.oldVolume
               ) {
                  //quantity not updated
                  this.updateSKU(
                     id,
                     description,
                     weight,
                     volume,
                     notes,
                     price,
                     availableQuantity
                  )
               } else {
                  //quantity updated
                  if (r.oldOccupiedVolume + volume > r.maxVolume) {
                     reject('exceeded')
                     return
                  }
                  if (r.oldOccupiedWeight + weight > r.maxWeight) {
                     reject('exceeded')
                     return
                  }

                  let newOccupiedWeight =
                     r.oldOccupiedWeight + weight - r.oldWeight
                  let newOccupiedVolume =
                     r.oldOccupiedVolume + volume - r.oldVolume
                  //update regularly
                  this.updateSKU(
                     id,
                     description,
                     weight,
                     volume,
                     notes,
                     price,
                     availableQuantity
                  )
                  const sql2 =
                     'UPDATE Position SET occupiedWeight=?, occupiedVolume=? WHERE positionID=?'
                  db.all(
                     sql2,
                     [newOccupiedWeight, newOccupiedVolume, r.positionID],
                     async (err, rows) => {
                        if (err) {
                           reject(err)
                           return
                        }
                     }
                  )
               }
               resolve(true)
            })
            .catch((e) => {
               //position is undefined so can update SKU regularly
               this.updateSKU(
                  id,
                  description,
                  weight,
                  volume,
                  notes,
                  price,
                  availableQuantity
               )
               resolve(true)
            })
      })
   }

   exports.editSKUPosition=async(id, newPositionID)=> {
      return new Promise(async (resolve, reject) => {
         let checkID = this.idExists(id)
         await checkID.then((found) => {
            if (found === false) {
               reject('id not found')
               return
            }
         })
         let checkPOS = this.isPositionAssigned(newPositionID)
         await checkPOS.then(async (found) => {
            //change to true
            if (found === true) {
               reject('assigned')
               return
            } else {
               let res = this.getPositionData(id)
               await res
                  .then(async (old) => {
                     //old position data and SKU data
                     let newpos =
                        this.getPositionDataByPositionID(newPositionID)
                     await newpos
                        .then((n) => {
                           //new position data
                           if (old.positionID === newPositionID) {
                              reject('error')
                              return
                           }
                           if (
                              n.oldOccupiedVolume + old.oldVolume >
                              n.maxVolume
                           ) {
                              reject('exceeded')
                              return
                           }
                           if (
                              n.oldOccupiedWeight + old.oldWeight >
                              n.maxWeight
                           ) {
                              reject('exceeded')
                              return
                           }
                           let newOccupiedWeight =
                              n.oldOccupiedWeight + old.oldWeight
                           let newOccupiedVolume =
                              n.oldOccupiedVolume + old.oldVolume
                           const sql1 =
                              'UPDATE Position SET occupiedWeight=?, occupiedVolume=? WHERE positionID=?'
                           db.all(
                              sql1,
                              [
                                 newOccupiedWeight,
                                 newOccupiedVolume,
                                 newPositionID,
                              ],
                              async (err, rows) => {
                                 if (err) {
                                    reject(err)
                                    return
                                 }
                              }
                           )

                           newOccupiedWeight =
                              old.oldOccupiedWeight - old.oldWeight
                           newOccupiedVolume =
                              old.oldOccupiedVolume - old.oldVolume
                           const sql2 =
                              'UPDATE Position SET occupiedWeight=?, occupiedVolume=? WHERE positionID=?'
                           db.all(
                              sql2,
                              [
                                 newOccupiedWeight,
                                 newOccupiedVolume,
                                 old.positionID,
                              ],
                              async (err, rows) => {
                                 if (err) {
                                    reject(err)
                                    return
                                 }
                              }
                           )

                           const sql3 = 'UPDATE SKU SET positionID=? WHERE Id=?'
                           db.all(
                              sql3,
                              [newPositionID, id],
                              async (err, rows) => {
                                 if (err) {
                                    reject(err)
                                    return
                                 }
                              }
                           )
                           resolve(true)
                        })
                        .catch((e) => {
                           //new position not existing
                           reject(e)
                           return
                        })
                  })
                  .catch(async (e) => {
                     //undefined old position, just update with the new one
                     let newpos =
                        this.getPositionDataByPositionID(newPositionID)
                     await newpos
                        .then(async (n) => {
                           //new position data
                           let SKU = this.getSKUData(id)
                           await SKU.then((sku) => {
                              if (
                                 n.oldOccupiedVolume + sku.oldVolume >
                                 n.maxVolume
                              ) {
                                 reject('exceeded')
                                 return
                              }
                              if (
                                 n.oldOccupiedWeight + sku.oldWeight >
                                 n.maxWeight
                              ) {
                                 reject('exceeded')
                                 return
                              }
                              let newOccupiedWeight =
                                 n.oldOccupiedWeight + sku.oldWeight
                              let newOccupiedVolume =
                                 n.oldOccupiedVolume + sku.oldVolume
                              const sql1 =
                                 'UPDATE Position SET occupiedWeight=?, occupiedVolume=? WHERE positionID=?'
                              db.all(
                                 sql1,
                                 [
                                    newOccupiedWeight,
                                    newOccupiedVolume,
                                    newPositionID,
                                 ],
                                 async (err, rows) => {
                                    if (err) {
                                       reject(err)
                                       return
                                    }
                                 }
                              )
                              const sql2 =
                                 'UPDATE SKU SET positionID=? WHERE Id=?'
                              db.all(
                                 sql2,
                                 [newPositionID, id],
                                 async (err, rows) => {
                                    if (err) {
                                       reject(err)
                                       return
                                    }
                                 }
                              )
                           })

                           resolve(true)
                        })
                        .catch((e) => {
                           //new position not existing
                           reject(e)
                           return
                        })
                  })
            }
         })
      })
   }

   exports.idExists=async(id)=> {
      return new Promise(async (resolve, reject) => {
         const sql = 'SELECT Id FROM SKU WHERE Id=?'
         db.get(sql, [id], async (err, rows) => {
            if (err) {
               reject(false)
               return
            } else {
               if (rows === undefined) resolve(false)
               else resolve(true)
            }
         })
      })
   }
   exports.isPositionAssigned=async(positionID)=> {
      return new Promise(async (resolve, reject) => {
         const sql = 'SELECT Id FROM SKU WHERE positionID=?'
         db.get(sql, [positionID], async (err, rows) => {
            if (err) {
               reject(false)
               return
            } else {
               if (rows === undefined) resolve(false)
               else resolve(true)
            }
         })
      })
   }
   exports.updateSKU=async(id, description, weight, volume, notes, price, availableQuantity) =>{
      const sql =
         'UPDATE SKU SET description=?, weight=?, volume=?, avaiableQuantity=?, price=?, notes=? WHERE Id=?'
      db.all(
         sql,
         [description, weight, volume, availableQuantity, price, notes, id],
         async (err, rows) => {
            if (err) {
               return err
            } else return rows
         }
      )
   }

   exports.getSKUData=async(id)=> {
      return new Promise(async (resolve, reject) => {
         const query = new Promise((resolve, reject) => {
            const sql =
               'SELECT S.positionID, S.weight, S.volume, S.avaiableQuantity FROM SKU as S WHERE S.Id=?'
            db.all(sql, [id], async (err, rows) => {
               if (err) {
                  reject('error')
                  return
               }
               resolve(rows[0])
            })
         }).catch((e) => reject(e))
         const res = await query
         if (res === undefined) reject('id not found')
         else {
            resolve({
               oldWeight: res.weight,
               oldVolume: res.volume,
               oldQuantity: res.availableQuantity,
            })
         }
      })
   }

   exports.getPositionData=async(id) =>{
      return new Promise(async (resolve, reject) => {
         const query = new Promise((resolve, reject) => {
            const sql =
               'SELECT maxWeight, maxVolume, occupiedWeight, occupiedVolume, S.positionID, S.weight, S.volume, S.avaiableQuantity FROM Position as P, SKU as S WHERE P.positionID=S.positionId and S.Id=?'
            db.all(sql, [id], async (err, rows) => {
               if (err) {
                  reject('error')
                  return
               }
               resolve(rows[0])
            })
         }).catch((e) => reject(e))
         const res = await query
         if (res === undefined) reject('id not found')
         else {
            resolve({
               positionID: res.positionID,
               maxWeight: res.maxWeight,
               maxVolume: res.maxVolume,
               oldOccupiedWeight: res.occupiedWeight,
               oldOccupiedVolume: res.occupiedVolume,
               oldWeight: res.weight,
               oldVolume: res.volume,
               oldQuantity: res.availableQuantity,
            })
         }
      })
   }

   exports.getPositionDataByPositionID=async (positionID)=> {
      return new Promise(async (resolve, reject) => {
         const query = new Promise((resolve, reject) => {
            const sql =
               'SELECT maxWeight, maxVolume, occupiedWeight, occupiedVolume FROM Position WHERE positionID=?'
            db.all(sql, [positionID], async (err, rows) => {
               if (err) {
                  reject('error')
                  return
               }
               resolve(rows[0])
            })
         }).catch((e) => reject(e))
         const res = await query
         if (res === undefined) reject('id not found')
         else {
            resolve({
               maxWeight: res.maxWeight,
               maxVolume: res.maxVolume,
               oldOccupiedWeight: res.occupiedWeight,
               oldOccupiedVolume: res.occupiedVolume,
            })
         }
      })
   }

   exports.getDescOfSku=async(id)=> {
      return new Promise((resolve, reject) => {
         const sql = 'SELECT T.id FROM Test_Descriptor as T WHERE T.SKU_Id=?'
         db.all(sql, [id], (err, rows) => {
            if (err) {
               reject(err)
               return
            }
            const descList = rows.map((r) => r.id)
            resolve(descList)
         })
      })
   }

   exports.deleteSKU=async(id)=> {
      return new Promise(async (resolve, reject) => {
         let checkID = this.idExists(id)
         await checkID.then((found) => {
            if (found === false) {
               reject('id not found')
               return
            }
         })
         const sql = 'DELETE FROM SKU WHERE Id=?'
         db.all(sql, [id], (err, rows) => {
            if (err) {
               reject(err)
               return
            }
            if (rows === undefined) reject('error')
            resolve(true)
         })
      })
   }

