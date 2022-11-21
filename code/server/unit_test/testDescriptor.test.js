const TestDescriptorService = require('../api/services/testDescriptorService')
const TestDescriptorMockingDao = require('../api/modules/mock/mock_testDescriptorDao');
const service = new TestDescriptorService(TestDescriptorMockingDao)


describe("GET functions", () => {

    beforeAll ( () => {
        TestDescriptorMockingDao.getTestDescriptors.mockReset()
        TestDescriptorMockingDao.getTestDescriptors.mockReturnValueOnce(
            [
                {
                    id: 1,
                    name: "First test descriptor",
                    procedureDescription: "First test description",
                    idSKU : 123
                },
                {
                    id: 2,
                    name: "Second test descriptor",
                    procedureDescription: "Second test description",
                    idSKU : 1234
                }
            ]
        ).mockImplementationOnce( () => new Error("Generic error") )

        TestDescriptorMockingDao.getTestDescriptorsId.mockReturnValueOnce(
            [
                {
                    id: 1,
                    name: "First test descriptor",
                    procedureDescription: "First test description",
                    idSKU : 123
                }
            ]           
        ).mockReturnValueOnce([]).mockImplementationOnce( () => new Error("Generic error") )
    })

    test("getTestDescriptors success", async () => {
        let expected_result = {
            ok: true,
            status: 200,
            body: 
            [
                {
                    id: 1,
                    name: "First test descriptor",
                    procedureDescription: "First test description",
                    idSKU : 123
                },
                {
                    id: 2,
                    name: "Second test descriptor",
                    procedureDescription: "Second test description",
                    idSKU : 1234
                }
            ]
        }
        const actual_result = await service.getTestDescriptors()
        expect(actual_result).toEqual(expected_result)
    });

    test("getTestDescriptors generic error", async () => {
        let expected_result = {
            ok: false,
            status: 500
        }
        const actual_result = await service.getTestDescriptors()
        expect(actual_result).toEqual(expected_result)
    })   

    test("getTestDescriptorsId success", async () => {
        let expected_result = {
            ok: true,
            status: 200,
            body: 
                {
                    id: 1,
                    name: "First test descriptor",
                    procedureDescription: "First test description",
                    idSKU : 123
                },
            
        } 
        const req = {
            params: {
                id: 1
            }
        }
        const actual_result = await service.getTestDescriptorsId(req)
        expect(actual_result).toEqual(expected_result)
    })

    test("getTestDescriptorsId not found", async () => {
        let expected_result = {
            ok: false,
            status: 404,
        } 
        const req = {
            params: {
                id: 1
            }
        }
        const actual_result = await service.getTestDescriptorsId(req)
        expect(actual_result).toEqual(expected_result)
    })

    test("getTestDescriptorsId generic error", async () => {
        let expected_result = {
            ok: false,
            status: 500,
        } 
        const req = {
            params: {
                id: 1
            }
        }
        const actual_result = await service.getTestDescriptorsId(req)
        expect(actual_result).toEqual(expected_result)
    })  
 
});

describe ("POST function", () => {

    beforeAll(() => {
        TestDescriptorMockingDao.postTestDescriptor.mockReset()
        TestDescriptorMockingDao.postTestDescriptor.mockReturnValueOnce(201).mockReturnValueOnce(404).mockRejectedValueOnce(100 /*Each rejected value raises 503*/)
    })

    test("postTestDescriptor success", async () => {
        let expected_result = {            
            ok: false,  
            status: 201
        }
        const req = {
            body: {
                name : "Test description",
                procedureDescription : "Procedure description", 
                idSKU : 1
            }
        }
        const actual_result = await service.postTestDescriptor(req)
        expect(actual_result).toEqual(expected_result)
    })

    test("postTestDescriptor not found", async () => {
        let expected_result = {            
            ok: false,  
            status: 404
        }
        const req = {
            body: {
                name : "Test description",
                procedureDescription : "Procedure description", 
                idSKU : 1
            }
        }
        const actual_result = await service.postTestDescriptor(req)
        expect(actual_result).toEqual(expected_result)
    })

    test("postTestDescriptor generic error", async () => {
        let expected_result = {            
            ok: false,  
            status: 503
        }
        const req = {
            body: {
                name : "Test description",
                procedureDescription : "Procedure description", 
                idSKU : 1
            }
        }
        const actual_result = await service.postTestDescriptor(req)
        expect(actual_result).toEqual(expected_result)
    })
}) 

describe("PUT function", () => {

    beforeAll(() => {
        TestDescriptorMockingDao.putTestDescriptorId.mockReset()
        TestDescriptorMockingDao.putTestDescriptorId.mockReturnValueOnce(200).mockReturnValueOnce(404).mockRejectedValueOnce(100 /*Each rejected value raises 503*/)
    })
    
    test("putTestDescriptorId success", async () => {
        let expected_result = {            
            ok: false,  
            status: 200
        }
        const req = {
            params: {
                id: 1
            },
            body: {
                newName : "Test description",
                newProcedureDescription : "Procedure description", 
                newIdSKU : 1
            }
        }
        const actual_result = await service.putTestDescriptorId(req)
        expect(actual_result).toEqual(expected_result)        
    })

    test("putTestDescriptorId not found", async () => {
        let expected_result = {            
            ok: false,  
            status: 404
        }
        const req = {
            params: {
                id: 1
            },
            body: {
                newName : "Test description",
                newProcedureDescription : "Procedure description", 
                newIdSKU : 1
            }
        }
        const actual_result = await service.putTestDescriptorId(req)
        expect(actual_result).toEqual(expected_result)        
    })

    test("putTestDescriptorId generic error", async () => {
        let expected_result = {            
            ok: false,  
            status: 503
        }
        const req = {
            params: {
                id: 1
            },
            body: {
                newName : "Test description",
                newProcedureDescription : "Procedure description", 
                newIdSKU : 1
            }
        }
        const actual_result = await service.putTestDescriptorId(req)
        expect(actual_result).toEqual(expected_result)        
    })

} )

describe("DELETE function", () => {
    beforeAll(() => {
        TestDescriptorMockingDao.deleteTestDescriptorId.mockReset()
        TestDescriptorMockingDao.deleteTestDescriptorId.mockReturnValueOnce(204).mockRejectedValueOnce(100 /*Each rejected value raises 503*/)
    })
    
    test("deleteTestDescriptorId success", async () => {
        let expected_result = {            
            ok: false,  
            status: 204
        }
        const req = {
            params: {
                id: 1
            }
        }
        const actual_result = await service.deleteTestDescriptorId(req)
        expect(actual_result).toEqual(expected_result)        
    })

    test("deleteTestDescriptorId generic error", async () => {
        let expected_result = {            
            ok: false,  
            status: 503
        }
        const req = {
            params: {
                id: 1
            }
        }
        const actual_result = await service.deleteTestDescriptorId(req)
        expect(actual_result).toEqual(expected_result)        
    })

})