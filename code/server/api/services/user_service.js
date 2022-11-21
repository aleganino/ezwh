'use strict'

class UserService {
   constructor(dao) {
      this.dao = dao
   }

   // userInfo = async () => {}

   getSuppliers = async () => {
      //401 not logged in / wrong permission
      //500 internal server error

      try {
         const suppliers = await this.dao.getSuppliers()
         return {
            ok: true,
            status: 200,
            body: suppliers.map((supplier) => ({
               id: supplier.id,
               name: supplier.name,
               surname: supplier.surname,
               email: supplier.username,
            })),
         }
      } catch (e) {

         return {
            ok: false,
            status: 500,
         }
      }
   }

   getUsers = async () => {
      //401 not logged in / wrong permission
      //500 internal server error

      try {
         const users = await this.dao.getUsers()
         return {
            ok: true,
            status: 200,
            body: users.map((user) => ({
               id: user.id,
               name: user.name,
               surname: user.surname,
               email: user.username,
               type: user.type,
            })),
         }
      } catch (e) {

         return {
            ok: false,
            status: 500,
         }
      }
   }

   createUser = async (body) => {
      //401 not logged in / wrong permission
      //409 conflicts
      //422 validation of body failed / attempt to create manager or admin
      //503 service unavailable

      if (Object.keys(body).length === 0 || String(body.password).length < 8) {
         return {
            ok: false,
            status: 422,
         }
      }
      const user = {
         username: String(body.username),
         name: String(body.name),
         surname: String(body.surname),
         password: String(body.password),
         type: String(body.type),
      }
      try {
         const res = await this.dao.createUser(user)
         if (res.changes > 0) {
            return {
               ok: true,
               status: 201,
            }
         } else {
            return {
               ok: true,
               status: 422,
            }
         }
      } catch (e) {

         if (e.code === 'SQLITE_CONSTRAINT') {
            return {
               ok: false,
               status: 422,
            }
         }
         return {
            ok: false,
            status: 503,
         }
      }
   }

   session = async (type, body) => {
      //401 wrong permission
      //500 internal server error

      const auth = {
         username: String(body.username),
         password: String(body.password),
         type: String(type),
      }
      if (auth.type === 'manager') {
         // manager1@ezwh.com testpassword
         if (
            auth.username === 'manager1@ezwh.com' &&
            auth.password === 'testpassword'
         ) {
            return {
               ok: true,
               status: 200,
               body: {
                  id: 0,
                  username: auth.username,
                  name: 'MANAGER_NAME',
               },
            }
         }
         return {
            ok: false,
            status: 401,
         }
      }

      try {
         const user = await this.dao.authUser(auth)
         if (user === undefined) {
            return {
               ok: false,
               status: 401,
            }
         }
         return {
            ok: true,
            status: 200,
            body: {
               id: user.id,
               username: user.username,
               name: user.name,
            },
         }
      } catch (e) {

         return {
            ok: false,
            status: 503,
         }
      }
   }

   // logout = async () => {}

   updateUser = async (username, body) => {
      //401 not logged in / wrong permission
      //404 item not found
      //422 validation failed
      //503 service unavailable

      if (Object.keys(body).length === 0) {
         return {
            ok: false,
            status: 422,
         }
      }
      const user = {
         username: String(username),
         old: String(body.oldType),
         new: String(body.newType)
      }
      try {
         const res = await this.dao.updateUser(user)

         if (res.changes > 0) {
            return {
               ok: true,
               status: 200,
            }
         } else {
            return {
               ok: false,
               status: 404,
            }
         }
      } catch (e) {

         if (e.code === 'SQLITE_CONSTRAINT') {
            return {
               ok: false,
               status: 404,
            }
         }
         return {
            ok: false,
            status: 503,
         }
      }
   }

   deleteUser = async(username, type) => {
      //401 not logged in / wrong permission
      //422 validation of id failed
      //404 item not found
      //503 service unavailable

      const user = {
         username: String(username),
         type: String(type)
      }
      try {
         const res = await this.dao.deleteUser(user)
         return {
            ok: true,
            status: 204,
         }
      } catch (e) {

         return {
            ok: false,
            status: 503,
         }
      }
   }
}

module.exports = UserService
