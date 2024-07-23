import { v4 as uuidv4 } from "uuid";

async function get(url, key) {
  return await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

async function post(url, data, key, headers = {}) {
  return await fetch(url, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

// First

export async function getAppId(key) {
  return (await get("https://api.circle.com/v1/w3s/config/entity", key)).data.appId;
}

export async function createUser(key) {
  let userId = uuidv4();
  return {
    userId,
    status: (await post("https://api.circle.com/v1/w3s/users", { userId }, key)).data.status,
  };
}

export async function acquireSessionToken(userId, key) {
  return (await post("https://api.circle.com/v1/w3s/users/token", { userId }, key)).data;
}

export async function initializeUser(token, key) {
  return (
    await post(
      "https://api.circle.com/v1/w3s/user/initialize",
      { idempotencyKey: uuidv4(), blockchains: ["MATIC-AMOY"] },
      key,
      {
        "X-User-Token": token,
      }
    )
  ).data.challengeId;
}

// Second

export async function getWallet(walletId, key) {
  return (await get(`https://api.circle.com/v1/w3s/wallets/${walletId}/balances`, key)).data;
}

export async function makeTransaction(userId, userToken, encryptionKey, walletId, tokenId, destinationAddress, key) {
  let idempotencyKey = uuidv4();

  return {
    userToken,
    encryptionKey,
    idempotencyKey,
    challengeId: (
      await post(
        "https://api.circle.com/v1/w3s/user/transactions/transfer",
        {
          idempotencyKey,
          userId,
          destinationAddress,
          refId: "",
          amounts: ["1"],
          feeLevel: "HIGH",
          tokenId,
          walletId,
        },
        key,
        {
          "X-User-Token": userToken,
        }
      )
    ).data.challengeId,
  };
}
