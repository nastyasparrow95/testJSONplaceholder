import supertest from 'supertest';
import test from "../config/baseUrl.js";
const request = supertest(test.baseUrl);

export default request;