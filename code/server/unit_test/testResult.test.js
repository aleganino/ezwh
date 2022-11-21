const TestResultService = require('../api/services/testResultService')
const TestResultMockedDao = require('../api/modules/mock/mock_testResultDao');

const service = new TestResultService(TestResultMockedDao)

describe("GET functions", () => {
    beforeAll ( () => {
        TestResultMockedDao.getSkuitemsRfidTestResults.mockReset()
        TestResultMockedDao.getSkuitemsRfidTestResults.mockResolvedValueOnce(
            [
                {
                    id:1,
                    idTestDescriptor:14,
                    Date:"2021/11/29",
                    Result: false,
                    RFID: "5555"
                },
                {
                    id:2,
                    idTestDescriptor:12,
                    Date:"2021/11/29",
                    Result: true,
                    RFID: "5555"
                }
            ]
        ).mockRejectedValueOnce(404).mockImplementationOnce(() => new Error("generic error"))

        TestResultMockedDao.getSkuitemsRfidTestResultsId.mockResolvedValueOnce(
            [
                {
                    id:1,
                    idTestDescriptor:14,
                    Date:"2021/11/29",
                    Result: false,
                    RFID:"5555"
                }
            ]           
        ).mockResolvedValueOnce([]).mockRejectedValueOnce(404)
    })

    test("getSkuitemsRfidTestResults success", async () => {
        let expected_result = {
            ok: true,
            status: 200,
            body: 
            [
                {
                    id:1,
                    idTestDescriptor: 14,
                    Date:"2021/11/29",
                    Result: false,
                    RFID: "5555"
                },
                {
                    id:2,
                    idTestDescriptor: 12,
                    Date:"2021/11/29",
                    Result: true,
                    RFID:"5555"
                }
            ]
        }
        const req = {
            params: {
                rfid: "5555"
            }
        }
        const actual_result = await service.getSkuitemsRfidTestResults(req)
        expect(actual_result).toEqual(expected_result)
    });

    test("getSkuitemsRfidTestResults not found", async () => {
        let expected_result = {
            ok: false,
            status: 404
        }
        const req = {
            params: {
                rfid: "5555"
            }
        }
        const actual_result = await service.getSkuitemsRfidTestResults(req)
        expect(actual_result).toEqual(expected_result)
    });

    test("getSkuitemsRfidTestResults generic error", async () => {
        let expected_result = {
            ok: false,
            status: 500
        }
        const req = {
            params: {
                rfid: "5555"
            }
        }
        const actual_result = await service.getSkuitemsRfidTestResults(req)
        expect(actual_result).toEqual(expected_result)
    });

    test("getSkuitemsRfidTestResultsId success", async () => {
        let expected_result = {
            ok: true,
            status: 200,
            body: 
            [
                {
                    id:1,
                    idTestDescriptor: 14,
                    Date:"2021/11/29",
                    Result: false,
                    RFID: "5555"
                }
            ]
        }
        const req = {
            params: {
                rfid: "5555"
            }
        }
        const actual_result = await service.getSkuitemsRfidTestResultsId(req)
        expect(actual_result).toEqual(expected_result)
    });

    test("getSkuitemsRfidTestResultsId empty list", async () => {
        let expected_result = {
            ok: true,
            status: 200,
            body: []
        }
        const req = {
            params: {
                rfid: "5555"
            }
        }
        const actual_result = await service.getSkuitemsRfidTestResultsId(req)
        expect(actual_result).toEqual(expected_result)
    });

    test("getSkuitemsRfidTestResultsId not found", async () => {
        let expected_result = {
            ok: false,
            status: 404
        }
        const req = {
            params: {
                rfid: "5555"
            }
        }
        const actual_result = await service.getSkuitemsRfidTestResultsId(req)
        expect(actual_result).toEqual(expected_result)
    });

    test("getSkuitemsRfidTestResultsId generic error", async () => {
        let expected_result = {
            ok: false,
            status: 500
        }
        const req = {
            params: {
                rfid: "5555"
            }
        }
        const actual_result = await service.getSkuitemsRfidTestResultsId(req)
        expect(actual_result).toEqual(expected_result)
    });
})

describe("POST functions", () => {

    beforeAll(() => {
        TestResultMockedDao.postSkuitemsTestResult.mockReset()
        TestResultMockedDao.postSkuitemsTestResult.mockReturnValueOnce(201).mockReturnValueOnce(404).mockRejectedValueOnce(100 /*Each rejected value raises 503*/)
    })

    test("postSkuitemsTestResult success", async () => {
        let expected_result = {            
            ok: false,  
            status: 201
        }
        const req = {
            body: {        
                rfid:"12345678901234567890123456789016",
                idTestDescriptor:12,
                Date:"2021/11/28",
                Result: true
            }
        }
        const actual_result = await service.postSkuitemsTestResult(req)
        expect(actual_result).toEqual(expected_result)
    })    

    test("postSkuitemsTestResult not found", async () => {
        let expected_result = {            
            ok: false,  
            status: 404
        }
        const req = {
            body: {        
                rfid:"12345678901234567890123456789016",
                idTestDescriptor:12,
                Date:"2021/11/28",
                Result: true
            }
        }
        const actual_result = await service.postSkuitemsTestResult(req)
        expect(actual_result).toEqual(expected_result)
    })    

    test("postSkuitemsTestResult generic error", async () => {
        let expected_result = {            
            ok: false,  
            status: 503
        }
        const req = {
            body: {        
                rfid:"12345678901234567890123456789016",
                idTestDescriptor:12,
                Date:"2021/11/28",
                Result: true
            }
        }
        const actual_result = await service.postSkuitemsTestResult(req)
        expect(actual_result).toEqual(expected_result)
    })    
})

describe("PUT functions", () => {

    beforeAll(() => {
        TestResultMockedDao.putSkuitemsRfidTestResultId.mockReset()
        TestResultMockedDao.putSkuitemsRfidTestResultId.mockReturnValueOnce(200).mockReturnValueOnce(404).mockRejectedValueOnce(100 /*Each rejected value raises 503*/)
    })
    
    test("putSkuitemsRfidTestResultId success", async () => {
        let expected_result = {            
            ok: false,  
            status: 200
        }
        const req = {
            params: {
                id: 1
            },
            body: {
                newIdTestDescriptor:12,
                newDate:"2021/11/28",
                newResult: true
            }
        }
        const actual_result = await service.putSkuitemsRfidTestResultId(req)
        expect(actual_result).toEqual(expected_result)        
    })

    test("putSkuitemsRfidTestResultId not found ", async () => {
        let expected_result = {            
            ok: false,  
            status: 404
        }
        const req = {
            params: {
                id: 1
            },
            body: {
                newIdTestDescriptor:12,
                newDate:"2021/11/28",
                newResult: true
            }
        }
        const actual_result = await service.putSkuitemsRfidTestResultId(req)
        expect(actual_result).toEqual(expected_result)        
    })

    test("putSkuitemsRfidTestResultId generic error", async () => {
        let expected_result = {            
            ok: false,  
            status: 503
        }
        const req = {
            params: {
                id: 1
            },
            body: {
                newIdTestDescriptor:12,
                newDate:"2021/11/28",
                newResult: true
            }
        }
        const actual_result = await service.putSkuitemsRfidTestResultId(req)
        expect(actual_result).toEqual(expected_result)        
    })
})

describe("DELETE functions", () => {
    beforeAll(() => {
        TestResultMockedDao.deleteSkuitemsRfidTestResultId.mockReset()
        TestResultMockedDao.deleteSkuitemsRfidTestResultId.mockReturnValueOnce(204).mockRejectedValueOnce(100 /*Each rejected value raises 503*/)
    })
    
    test("deleteSkuitemsRfidTestResultId success", async () => {
        let expected_result = {            
            ok: false,  
            status: 204
        }
        const req = {
            params: {
                id: 1
            }
        }
        const actual_result = await service.deleteSkuitemsRfidTestResultId(req)
        expect(actual_result).toEqual(expected_result)        
    })

    test("deleteSkuitemsRfidTestResultId generic error", async () => {
        let expected_result = {            
            ok: false,  
            status: 503
        }
        const req = {
            params: {
                id: 1
            }
        }
        const actual_result = await service.deleteSkuitemsRfidTestResultId(req)
        expect(actual_result).toEqual(expected_result)        
    })
})