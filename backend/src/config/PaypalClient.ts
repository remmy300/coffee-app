import { Client, Environment, LogLevel } from "@paypal/paypal-server-sdk";
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from "./config.js";

console.log("PayPal Client ID (PaypalClient):", PAYPAL_CLIENT_ID);
console.log(
  "PayPal Secret (PaypalClient):",
  PAYPAL_CLIENT_SECRET ? " Loaded" : " Missing"
);

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID,
    oAuthClientSecret: PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

export default client;
