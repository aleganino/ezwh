'use strict'
const sqlite = require('sqlite3')
const dbPath = require('../../server').databasePath
const db = new sqlite.Database(dbPath, (err) => {
    if (err) throw err
    db.run("PRAGMA foreign_keys = ON")
})

function checkPresence(table, condition) {
    const sql = `SELECT COUNT() AS isInTable FROM ${table} WHERE ${condition};`
    return new Promise((resolve, reject) => {
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



exports.getSkuitemsRfidTestResults = async (rfid) => {
    const sql = `SELECT * FROM Test_Result WHERE RFID="${rfid}";`
    return await new Promise((resolve, reject) => {
        checkPresence("SKU_Item", `RFID = "${rfid}"`).then (() => {
            db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const result = Promise.all(
                        rows.map(async (row) => {
                        return {
                            id: row.id,
                            idTestDescriptor: row.testDescriptorID,
                            Date : row.date,
                            Result : row.result,
                            RFID: row.RFID
                        }
                        })
                    )
                    resolve(result)
                }
            })
            },
            (status) => reject(status)
        )
    })
}


exports.getSkuitemsRfidTestResultsId = async (rfid, id) => {
    const sql = `SELECT * FROM Test_Result WHERE RFID="${rfid}" AND id=${id};`
    return await new Promise((resolve, reject) => {
        checkPresence("SKU_Item", `RFID = "${rfid}"`).then (() => {
            db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const result = Promise.all(
                        rows.map(async (row) => {
                            return {
                                id: row.id,
                                idTestDescriptor: row.testDescriptorID,
                                Date : row.date,
                                Result : row.result,
                                RFID: row.RFID
                            }
                        })
                    )
                    resolve(result)
                }
            })
            },
            (status) => reject(status)
        )
    })
}

exports.postSkuitemsTestResult = async (rfid, idTestDescriptor, date, result) => {
    const sql1 = 'SELECT MAX(id) AS maxId FROM Test_Result;'
    return new Promise((resolve, reject) => {
        checkPresence("SKU_Item", `RFID="${rfid}"`).then(
            () => {
                checkPresence("Test_Descriptor", `id="${idTestDescriptor}"`).then(
                    () => {
                        db.all(sql1, (err, rows) => {
                            if (err) {
                                reject(err)
                            } else {
                                rows.map(
                                    (row) =>  new Promise((resolve, reject) => {
                                        const sql2 = `INSERT INTO Test_Result (id, testDescriptorID, date, result, RFID ) VALUES (${row.maxId + 1},${idTestDescriptor},"${date}","${result}","${rfid}");`
                                        db.all(sql2, (err, rows) => {
                                            if (err) {
                                                reject(err)
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
                        })
                    },
                    (errCode) => resolve(errCode)
                )
            },
            (errCode) => resolve (errCode)
        )
    })
}

exports.putSkuitemsRfidTestResultId = async (rfid, id, newIdTestDescriptor, newDate, newResult) => {
    const sql = `UPDATE Test_Result
    SET testDescriptorID=${newIdTestDescriptor}, date="${newDate}", result=${newResult}
    WHERE id = ${id};`
    return new Promise((resolve, reject) => {
        checkPresence("Test_Result", `id=${id}`).then(
            () => {
                checkPresence("SKU_Item", `RFID="${rfid}"`).then(
                    () => {
                        checkPresence("Test_Descriptor", `id="${newIdTestDescriptor}"`).then(
                            () => {
                                db.all(sql, (err, rows) => {
                                    if (err) {
                                        reject(err)
                                    } else {
                                        resolve(200)
                                    }
                                })
                            },
                            (errCode) => resolve(errCode)
                        )
                    },
                    (errCode) => resolve (errCode)
                )
            },
            (errCode) => resolve(errCode)
        )
    })
}

exports.deleteSkuitemsRfidTestResultId = (rfid, id) => {
    const sql1 = ` DELETE FROM Test_Result where id=${id};`
    return new Promise((resolve, reject) => {
        checkPresence("Test_Result", `id=${id}`).then(
            () => {
                checkPresence("SKU_Item", `RFID="${rfid}"`).then(
                    () => {
                        db.all(sql1, (err, rows) => {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(204)
                            }
                        })
                    },
                    (errCode) => resolve (errCode)
                )
            },
            (errCode) => resolve(errCode)
        )
    })
}
