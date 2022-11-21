'use strict'

class TestDescriptorService {
   constructor(dao) {
      this.dao = dao
   }

   getTestDescriptors = async (req, res) => {
      try {
         const results = await this.dao.getTestDescriptors()
         const resBody =  results.map( (result) => ({
            id: parseInt(result.id),
            name: result.name,
            procedureDescription: result.procedureDescription,
            idSKU : parseInt(result.idSKU)
         }))
         return {
            ok: true,
            status: 200,
            body: resBody
         }
      }
      catch (err) {

         return {
            ok: false,
            status: 500
         }
      }
   }

   getTestDescriptorsId = async (req, res) => {
      try {
         const results = await this.dao.getTestDescriptorsId(req.params.id)
         if (results.length === 0)
            return {
               ok: false,
               status: 404
            }
         const resBody =  results.map( (result) => ({
            id: parseInt(result.id),
            name: result.name,
            procedureDescription: result.procedureDescription,
            idSKU : parseInt(result.idSKU)
         })).pop()
         return {
            ok: true,
            status: 200,
            body: resBody
         }
      }
      catch (err) {

         return {
            ok: false,
            status: 500
         }
      }
   }

   postTestDescriptor = async (req, res) => {
      try {
         const status = await this.dao.postTestDescriptor(req.body.name, req.body.procedureDescription, req.body.idSKU)
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

   putTestDescriptorId = async (req, res) => {
      try {
         const status = await this.dao.putTestDescriptorId(req.params.id, req.body.newName,req.body.newProcedureDescription,req.body.newIdSKU)
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

   deleteTestDescriptorId = async (req, res) => {
      try {
         const status = await this.dao.deleteTestDescriptorId(req.params.id)
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

module.exports = TestDescriptorService