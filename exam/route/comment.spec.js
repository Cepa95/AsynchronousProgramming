const { expect } = require("chai");

describe("Comment routes", function () {
  describe("POST /comments", function () {
    it("should create a new comment", async function () {
      const newMessage = "newMessage";
      const senderId = 1;
      const groupId = 3;
      const resp = await global.api
        .post("/comments")
        .send({
          message: newMessage,
          sender_id: senderId,
          group_id: groupId,
        })
        .expect(200);

      expect(resp.body.message).to.be.equal(newMessage);
    });
  });

  describe("GET /user-comments", () => {
    it("should get comments successfully", async () => {
      const mockUser = await global.api
        .post("/login")
        .send({ email: "user01@mail.com", password: "sifra123" });

      const response = await global.api
        .get(`/user-comments`)
        .set("Authorization", `Bearer ${mockUser.body.token}`);

      expect(response.status).to.equal(200);
    });

    it("should return an error if no token is provided", async () => {
      const response = await global.api.get(`/user-comments`);

      expect(response.status).to.equal(401);
    });
  });
});
