'use strict'

class TestResultService {
    constructor(dao) {
       this.dao = dao
    }

    getSkuitemsRfidTestResults = async (req, res) => {
        try {
            const results = await this.dao.getSkuitemsRfidTestResults(req.params.rfid).then ((resBody) => {
                resBody.map( (result) => ({
                    id: parseInt(result.id),
                    idTestDescriptor: parseInt(result.idTestDescriptor),
                    Date : result.Date,
                    Result : Boolean<String>(result.Result),
                    RFID : result.RFID
                }))
                return {
                    ok: true,
                    status: 200,
                    body: resBody
                }
                },
                (err) => {
                    return {
                        ok: false,
                        status: err
                }}
            )
            return results
        }
        catch (err) {

            return {
               ok: false,
               status: 500
            }
        }
    }


    getSkuitemsRfidTestResultsId = async (req, res) => {
        try {
            const results = await this.dao.getSkuitemsRfidTestResultsId(req.params.rfid, req.params.id).then ((resBody) => {
                resBody.map( (result) => ({
                    id: parseInt(result.id),
                    idTestDescriptor: parseInt(result.idTestDescriptor),
                    Date : result.Date,
                    Result : Boolean<String>(result.Result),
                    RFID : result.RFID
                }))
                return {
                    ok: true,
                    status: 200,
                    body: resBody
                }
                },
                (err) => {
                    return {
                        ok: false,
                        status: err
                }}
            )
            return results
        }
        catch (err) {

            return {
               ok: false,
               status: 500
            }
        }
    }

    postSkuitemsTestResult = async (req, res) => {
        try {
            const status = await this.dao.postSkuitemsTestResult(req.body.rfid, req.body.idTestDescriptor, req.body.Date, req.body.Result)
            return {
               ok: false,
               status: status
            }
        }
        catch (err) {

            return {
               ok: false,
               status: 503
            }
        }
    }

    putSkuitemsRfidTestResultId = async (req, res) => {
        try {
            const status = await this.dao.putSkuitemsRfidTestResultId(req.params.rfid, req.params.id, req.body.newIdTestDescriptor, req.body.newDate, req.body.newResult)
            return {
               ok: false,
               status: status
            }
        }
        catch (err) {

            return {
               ok: false,
               status: 503
            }
        }
    }

    deleteSkuitemsRfidTestResultId = async (req, res) => {
        try {
            const status = await this.dao.deleteSkuitemsRfidTestResultId(req.params.rfid, req.params.id)
            return {
               ok: false,
               status: status
            }
        }
        catch (err) {

            return {
               ok: false,
               status: 503
            }
        }
    }

}

module.exports = TestResultService