import mongoose from "mongoose";
import request from "supertest";

import app, { server } from "..";
import { Transaction, User } from "../models";

const api = request(app);

let user1: any;
let user2: any;
let user3: any;
let transaction1: any;
let transaction2: any;
let transaction3: any;

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Transaction.deleteMany({});
  user1 = await User.create({
    name: "Tom",
    token: 5000,
  });
  user2 = await User.create({
    name: "Jack",
    token: 8000,
  });
  user3 = await User.create({
    name: "Tommy",
    token: 8000,
  });
  transaction1 = await Transaction.create({
    sender: user1._id,
    receiver: user2._id,
    amount: 100,
  });
  transaction2 = await Transaction.create({
    sender: user2._id,
    receiver: user1._id,
    amount: 500,
  });
  transaction3 = await Transaction.create({
    sender: user2._id,
    receiver: user3._id,
    amount: 300,
  });
});

describe("Add user test", () => {
  it("Successfully created", async () => {
    const response = await api.post("/users").send({
      name: "Tommy",
      token: 100,
    });
    const data = response.body;

    expect(response.status).toBe(201);

    expect(data.id).toBeDefined();
    expect(data.createdDate).toBeDefined();
  });

  it("Failed to create user because name field is empty", async () => {
    try {
      await api.post("/users").send({
        name: "",
        token: 100,
      });
    } catch (err: any) {
      const { status, data } = err.response;

      expect(status).toBe(400);

      expect(data.msg).toBe("Name is required");
    }
  });

  it("Failed to create user because token field is empty", async () => {
    try {
      await api.post("/users").send({
        name: "Jack",
        token: 0,
      });
    } catch (err: any) {
      const { status, data } = err.response;

      expect(status).toBe(400);

      expect(data.msg).toBe("Token is required");
    }
  });

  it("Failed to create user because token is smaller than 0", async () => {
    try {
      await api.post("/users").send({
        name: "Jack",
        token: -100,
      });
    } catch (err: any) {
      const { status, data } = err.response;

      expect(status).toBe(400);

      expect(data.msg).toBe("Token must be a number greater than 0");
    }
  });
});

describe("Get users and specific user test", () => {
  it("Successfully get users", async () => {
    try {
      const res = await api.get("/users");
      const user = res.body;

      expect(res.status).toBe(200);

      expect(user[0].name).toBe("Tom");
      expect(user[0].token).toBe(5000);
      expect(user[1].name).toBe("Jack");
      expect(user[1].token).toBe(8000);
    } catch (err: any) {
      const { status, data } = err.response;

      expect(status).toBe(500);

      expect(data.msg).toBe("An error occured while adding the user!");
    }
  });

  it("Successfully get specific user", async () => {
    try {
      const res = await api.get(`/users/${user1._id}`);
      const { name, token } = res.body;

      expect(name).toBe("Tom");
      expect(token).toBe(5000);
    } catch (err: any) {
      const { status, data } = err.response;
      expect(status).toBe(500);

      expect(data.msg).toBe(
        "An error occurred while getting the list of users."
      );
    }
  });

  it("Failed to get specific user because incorrect id", async () => {
    try {
      const res = await api.get("/users/x");
    } catch (err: any) {
      const { status, data } = err.response;

      expect(status).toBe(400);

      expect(data.msg).toBe("User not found!");
    }
  });
});

describe("Add transaction test", () => {
  it("Successfully created", async () => {
    const response = await request(app)
      .post("/transaction")
      .send({
        sender: user1._id,
        receiver: user2._id,
        amount: 100,
      });

    const { msg } = response.body;

    expect(response.status).toBe(201);
    expect(msg).toBe("Transaction created successfully!");
  });

  it("Failed to create because sender is empty", async () => {
    try {
      await request(app).post("/transaction").send({
        sender: "",
        receiver: user2._id,
        amount: 100,
      });
    } catch (err: any) {
      const { status, data } = err.response;

      expect(status).toBe(404);

      expect(data.msg).toBe("Sender does not exist.");
    }
  });

  it("Failed to create because receiver is empty", async () => {
    try {
      await request(app).post("/transaction").send({
        sender: user1._id,
        receiver: "",
        amount: 100,
      });
    } catch (err: any) {
      const { status, data } = err.response;

      expect(status).toBe(404);

      expect(data.msg).toBe("Receiver does not exist.");
    }
  });

  it("Failed to create because amount is empty", async () => {
    try {
      await request(app).post("/transaction").send({
        sender: user1._id,
        receiver: "",
        amount: 0,
      });
    } catch (err: any) {
      const { status, data } = err.response;

      expect(status).toBe(404);

      expect(data.msg).toBe("Token is required");
    }
  });

  it("Failed to create because amount is negative value", async () => {
    try {
      await request(app).post("/transaction").send({
        sender: user1._id,
        receiver: user2._id,
        amount: 0,
      });
    } catch (err: any) {
      const { status, data } = err.response;

      expect(status).toBe(404);

      expect(data.msg).toBe("Token must be a number greater than 0");
    }
  });

  it("Failed to create because receiver is same with sender", async () => {
    try {
      await request(app).post("/transaction").send({
        sender: user1._id,
        receiver: user1._id,
        amount: 1000,
      });
    } catch (err: any) {
      const { status, data } = err.response;

      expect(status).toBe(404);

      expect(data.msg).toBe("Sender can't be same with receiver.");
    }
  });

  it("Failed to create because sender hasn't got enough money", async () => {
    try {
      await request(app).post("/transaction").send({
        sender: user1._id,
        receiver: user2._id,
        amount: 10000,
      });
    } catch (err: any) {
      const { status, data } = err.response;

      expect(status).toBe(404);

      expect(data.msg).toBe("Sender hasn't got enough money.");
    }
  });

  it("Failed to sender does not exist", async () => {
    try {
      await request(app).post("/transaction").send({
        sender: "x",
        receiver: user2._id,
        amount: 100,
      });
    } catch (err: any) {
      const { status, data } = err.response;

      expect(status).toBe(404);

      expect(data.msg).toBe("Sender does not exist.");
    }
  });

  it("Failed to receiver does not exist", async () => {
    try {
      await request(app).post("/transaction").send({
        sender: user1._id,
        receiver: "x",
        amount: 100,
      });
    } catch (err: any) {
      const { status, data } = err.response;

      expect(status).toBe(404);

      expect(data.msg).toBe("Receiver does not exist.");
    }
  });
});

describe("Get specific transactions", () => {
  it("Successfully get transactions", async () => {
    const response = await api.get(`/transaction/${user1._id}`);
    const data = response.body;

    expect(response.status).toBe(200);

    expect(data[0]._id).toBe(String(transaction1._id));
    expect(data[1]._id).toBe(String(transaction2._id));
  });

  it("Failed to get transactions", async () => {
    try {
      const response = await api.get("/transaction/x");
    } catch (err: any) {
      const { status, data } = err.response;

      expect(status).toBe(500);

      expect(data.msg).toBe(
        "An error occurred while getting the list of transaction."
      );
    }
  });
});
