"use server";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export const initialize_user = async () => {
  const idempotencyKey = uuidv4(); // generates an idempotency key

  const options = {
    method: "POST",
    url: "https://api.circle.com/v1/w3s/user/initialize",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer  TEST_API_KEY:b274f8905861b655f707f1930175506e:db19444e9963fac41c90dab8226c0b4e`,
      "X-User-Token": `${process.env.NEXT_PUBLIC_USER_TOKEN}`,
    },
    data: { idempotencyKey: idempotencyKey, blockchains: ["MATIC-AMOY"] },
  };

  return axios
    .request(options)
    .then(function (response) {
      console.log("idempotency key: ", idempotencyKey);
      return response.data.data.challengeId;
    })
    .catch(function (error) {
      console.error(error);
    });
};
