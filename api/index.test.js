const request = require("supertest");
const app = require("./index.js");

describe("POST /login", () => {
  describe("given a email and password", () => {
    test("should specify json in the content type header", async () => {
      const response = await request(app).post("/login").send({
        email: "aditya@gmail.com",
        password: "123456",
      });
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
    test("response has user", async () => {
      const response = await request(app).post("/login").send({
        email: "aditya@gmail.com",
        password: "123456",
      });
      expect(response.body).toBeDefined();
    });
  });

  describe("when the username and password is missing", () => {
    test("should respond with a status code of 4xx", async () => {
      const bodyData = [{ username: "abc" }, { password: "def" }, {}];
      for (const body of bodyData) {
        const response = await request(app).post("/login").send(body);
        expect(response.statusCode).toBe(404);
      }
    });
  });
});
