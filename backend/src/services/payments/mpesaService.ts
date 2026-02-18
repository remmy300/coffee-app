import crypto from "crypto";

type MpesaInitiateArgs = {
  phone: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
};

const MPESA_BASE_URL = process.env.MPESA_BASE_URL || "";
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || "";
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || "";
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || "";
const MPESA_PASSKEY = process.env.MPESA_PASSKEY || "";
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || "";
const MPESA_CALLBACK_TOKEN = process.env.MPESA_CALLBACK_TOKEN || "";

const getTimestamp = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${yyyy}${MM}${dd}${hh}${mm}${ss}`;
};

const isMpesaConfigured = () => {
  return Boolean(
    MPESA_BASE_URL &&
      MPESA_CONSUMER_KEY &&
      MPESA_CONSUMER_SECRET &&
      MPESA_SHORTCODE &&
      MPESA_PASSKEY &&
      MPESA_CALLBACK_URL,
  );
};

const normalizePhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("254")) return cleaned;
  if (cleaned.startsWith("0")) return `254${cleaned.slice(1)}`;
  return cleaned;
};

const getMpesaAccessToken = async () => {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString(
    "base64",
  );

  const response = await fetch(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: { Authorization: `Basic ${auth}` },
    },
  );

  if (!response.ok) {
    throw new Error(`M-Pesa auth failed: ${response.statusText}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("M-Pesa auth token missing in response");
  }

  return data.access_token;
};

export const initiateMpesaStkPush = async (payload: MpesaInitiateArgs) => {
  if (!isMpesaConfigured()) {
    return {
      ok: true,
      mock: true,
      checkoutRequestId: `mock_${crypto.randomUUID()}`,
      customerMessage:
        "M-Pesa credentials not configured. Returning mock checkout request.",
    };
  }

  const callbackUrl = (() => {
    if (!MPESA_CALLBACK_TOKEN) return MPESA_CALLBACK_URL;
    const separator = MPESA_CALLBACK_URL.includes("?") ? "&" : "?";
    return `${MPESA_CALLBACK_URL}${separator}token=${encodeURIComponent(MPESA_CALLBACK_TOKEN)}`;
  })();

  const timestamp = getTimestamp();
  const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString(
    "base64",
  );
  const token = await getMpesaAccessToken();
  const phoneNumber = normalizePhone(payload.phone);

  const response = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(payload.amount),
      PartyA: phoneNumber,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackUrl,
      AccountReference: payload.accountReference,
      TransactionDesc: payload.transactionDesc,
    }),
  });

  const data = (await response.json()) as Record<string, unknown>;
  if (!response.ok) {
    throw new Error(
      typeof data.errorMessage === "string"
        ? data.errorMessage
        : "M-Pesa STK push failed",
    );
  }

  return {
    ok: true,
    mock: false,
    checkoutRequestId:
      (data.CheckoutRequestID as string) ||
      (data.checkoutRequestId as string) ||
      `stk_${crypto.randomUUID()}`,
    merchantRequestId:
      (data.MerchantRequestID as string) || (data.merchantRequestId as string),
    customerMessage:
      (data.CustomerMessage as string) ||
      "STK Push sent. Please complete payment on your phone.",
    raw: data,
  };
};
