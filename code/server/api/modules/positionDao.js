'use strict'
const sqlite = require('sqlite3')
const dbPath = require('../../server').databasePath
const db = new sqlite.Database(dbPath, (err) => {
   if (err) throw err
   db.run("PRAGMA foreign_keys = ON")
})

    exports.getPositions=async()=> {
        return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Position'
        db.all(sql, [], async (err, rows) => {
            if (err) {

                reject(500)
                return
            }
            let list = rows.map((r) => {
                return {
                    positionID: r.positionID,
                    aisleID: r.aisleID,
                    row: r.row,
                    col: r.col,
                    maxWeight:r.maxWeight,
                    maxVolume:r.maxVolume,
                    occupiedWeight:r.occupiedWeight,
                    occupiedVolume:r.occupiedVolume,
                }
            })
            resolve(list)
            })
        })
    }

    exports.createPosition=async(positionID, aisleID, row, col, maxVolume, maxWeight)=>{
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO Position (positionID, aisleID, row, col, maxVolume, maxWeight, occupiedWeight, occupiedVolume) VALUES (?,?,?,?,?,?,0,0)'
            db.all(sql, [positionID, aisleID, row, col, maxVolume, maxWeight], async (err, rows) => {
                if (err) {
                    reject(503)
                    return
                }
                resolve(true);
            });
        });
    }

    exports.editPosition=async(positionID, newPositionID, aisleID, row, col, maxVolume, maxWeight, occupiedVolume, occupiedWeight)=>{
        return new Promise(async (resolve, reject) => {
            const check = await this.positionExists(positionID).catch(()=>reject(503));
            if (!check) {
                reject('id not found')
                return
            }
            const sql = 'UPDATE Position SET positionID=?, aisleID=?, row=?, col=?, maxVolume=?, maxWeight=?, occupiedVolume=?, occupiedWeight=? WHERE positionID=?'
            db.all(sql, [newPositionID, aisleID, row, col, maxVolume, maxWeight, occupiedVolume, occupiedWeight, positionID], (err, rows) => {
                if (err) {

                    reject(503)
                    return
                }else
                resolve(true);
            });
        });
    }

    exports.editPositionID=async(newPositionID, oldPositionID, aisleID,row,col)=>{
        return new Promise(async (resolve, reject) => {
            const check = await this.positionExists(oldPositionID).catch(()=>reject(503));
            if (!check) {
                reject('id not found')
                return
            }
            const sql = 'UPDATE Position SET positionID=?, aisleID=?, row=?, col=? WHERE positionID=?'
            db.all(sql, [newPositionID, aisleID, row, col, oldPositionID], (err, rows) => {
                if (err) {

                    reject(503)
                    return
                }else
                resolve(true);
            });
        });
    }

    exports.positionExists=async(positionID)=> {
        return new Promise(async (resolve, reject) => {
           const sql = 'SELECT positionID FROM Position WHERE positionID=?'
           db.get(sql, [positionID], async (err, rows) => {
              if (err) {
                 reject(err)
                 return
              } else {
                 if (rows === undefined) resolve(false)
                 else resolve(true)
              }
           })
        })
    }

    exports.deletePosition=async(positionID)=> {
        return new Promise(async (resolve, reject) => {
           const check = await this.positionExists(positionID).catch(()=>reject(503))
           if (!check) {
              reject('id not found')
              return
           }
           const sql = 'DELETE FROM Position WHERE positionID=?'
           db.run(sql, [positionID], (err) => {
              if (err) {
                 reject(503)
                 return
              }
              resolve(true)
           })
        })
    }

