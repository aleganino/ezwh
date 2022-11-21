const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
chai.should();

const app = require("../server");
var agent = chai.request.agent(app);


describe("Testing Users", function () {
  //create the user
  it("POST /api/newUser", async () => {
    const result = await agent
      .post("/api/newUser")
      .set("content-type", "application/json")
      .send({
        username: 'user'+Math.floor(Math.random() * 2000)+'@ezwh.com',
        name: "Jack",
        surname: "Sparrow",
        password: "testpassword",
        type: "customer",
      });
    console.log(result.status);
    result.should.have.status(201);
  });


//create the sessions



  it("POST /api/supplierSessions", async () => {
    const result = await agent
      .post("/api/supplierSessions")
      .set("content-type", "application/json")
      .send( {username: "supplier1@ezwh.com",password: "testpassword",});
    console.log(result.status);
    result.should.have.status(200);
  });



  it("POST /api/qualityEmployeeSessions", async () => {
    const result = await agent
      .post("/api/qualityEmployeeSessions")
      .set("content-type", "application/json")
      .send( {username: "qualityEmployee1@ezwh.com",password: "testpassword",});
    console.log(result.status);
    result.should.have.status(200);
  });



  it("POST /api/deliveryEmployeeSessions", async () => {
    const result = await agent
      .post("/api/deliveryEmployeeSessions")
      .set("content-type", "application/json")
      .send( {username: "deliveryEmployee1@ezwh.com",password: "testpassword",});
    console.log(result.status);
    result.should.have.status(200);
  });



  it("POST /api/logout", async () => {
    const result = await agent
      .post("/api/logout")
      .set("content-type", "application/json")
      .send();
    result.should.have.status(200);
  });

  it("PUT /api/users/user1357@ezwh.com", async () => {
    const result = await agent
      .put("/api/users/user1357@ezwh.com")
      .set("content-type", "application/json")
      .send( {username: "user1357@ezwh.com",password: "testpassword",
        newType: 'clerk',
     });
    result.should.have.status(200);
  });
  it("PUT /api/users/user1357ezwh.com", async () => {
    const result = await agent
      .put("/api/users/user1357ezwh.com")
      .set("content-type", "application/json")
      .send( {username: "user1357ezwh.com",password: "testpassword",
        newType: 'clerk',
     });
    result.should.have.status(404);
  });

  it("Delete /api/users/user58@ezwh.com/customer", async () => {
        const result = await agent.delete('/api/users/user58@ezwh.com/customer')
        result.should.have.status(204)
  });

});