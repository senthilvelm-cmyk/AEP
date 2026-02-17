import { loadEnvironment } from "../config/env";

const env = loadEnvironment();

export const testData = {
  login: {
    username: env.username,
    password: env.password
  }
};
