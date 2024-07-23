import { getAppId, createUser, acquireSessionToken, initializeUser } from "./functions.js";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;
const APP_ID = await getAppId(API_KEY);

console.log("APP_ID:", APP_ID);

let user = await createUser(API_KEY);

console.log("user:", user);

let session = await acquireSessionToken(user.userId, API_KEY);

console.log("session:", session);

let challengeId = await initializeUser(session.userToken, API_KEY);

console.log("challengeId:", challengeId);
