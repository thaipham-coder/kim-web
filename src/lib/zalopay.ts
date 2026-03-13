import crypto from "crypto";

// ======================================
// ZaloPay Configuration
// ======================================

const config = {
  app_id: Number(process.env.ZALOPAY_APP_ID),
  key1: process.env.ZALOPAY_KEY_1!,
  key2: process.env.ZALOPAY_KEY_2!,
  createOrderEndpoint: "https://sb-openapi.zalopay.vn/v2/create",
  queryOrderEndpoint: "https://sb-openapi.zalopay.vn/v2/query",
};

// ======================================
// Helpers
// ======================================

function hmacSHA256(key: string, data: string): string {
  return crypto.createHmac("sha256", key).update(data).digest("hex");
}

function generateAppTransId(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000000);
  return `${yy}${mm}${dd}_${config.app_id}_${random}`;
}

// ======================================
// CreateOrder API
// ======================================

interface CreateOrderParams {
  amount: number;
  description: string;
  items: Array<any>;
  callbackUrl: string;
  redirectUrl?: string; // used for gateway mode or fallback
}

interface CreateOrderResponse {
  return_code: number;
  return_message: string;
  sub_return_code: number;
  sub_return_message: string;
  order_url?: string;
  zp_trans_token?: string;
  order_token?: string;
  qr_code?: string;
  app_trans_id: string; // appended for our usage
}

/**
 * Tạo đơn hàng trên ZaloPay
 * Đối với ZaloPay QR Động, trả về order_url dùng để render mã QR tĩnh (hoặc dùng qrcode.react)
 */
export async function createZaloPayOrder(
  params: CreateOrderParams
): Promise<CreateOrderResponse> {
  const appTransId = generateAppTransId();
  const appTime = Date.now();

  const embedData = JSON.stringify({
    redirecturl: params.redirectUrl || "",
    preferred_payment_method: [],
  });
  
  const itemStr = JSON.stringify(params.items);

  const orderData: Record<string, any> = {
    app_id: config.app_id,
    app_trans_id: appTransId,
    app_user: "user",
    app_time: appTime,
    amount: params.amount,
    description: params.description,
    bank_code: "zalopayapp",
    item: itemStr,
    embed_data: embedData,
    callback_url: params.callbackUrl,
  };

  const macDataArray = [
    orderData.app_id,
    orderData.app_trans_id,
    orderData.app_user,
    orderData.amount,
    orderData.app_time,
    orderData.embed_data,
    orderData.item,
  ];
  
  const macData = macDataArray.join("|");
  orderData.mac = hmacSHA256(config.key1, macData);

  const response = await fetch(config.createOrderEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(
      Object.entries(orderData).map(([k, v]) => [k, String(v)])
    ),
  });

  const result = await response.json();

  return {
    ...result,
    app_trans_id: appTransId,
  };
}

// ======================================
// Verify Callback (IPN)
// ======================================

interface CallbackData {
  app_id: number;
  app_trans_id: string;
  app_time: number;
  app_user: string;
  amount: number;
  embed_data: string;
  item: string;
  zp_trans_id: number;
  server_time: number;
  channel: number;
  merchant_user_id: string;
  user_fee_amount: number;
  discount_amount: number;
}

export function verifyCallback(
  dataStr: string,
  reqMac: string
): { isValid: boolean; data: CallbackData | null } {
  const mac = hmacSHA256(config.key2, dataStr);

  if (reqMac !== mac) {
    return { isValid: false, data: null };
  }

  const data: CallbackData = JSON.parse(dataStr);
  return { isValid: true, data };
}

// ======================================
// Query Order Status
// ======================================

interface QueryOrderResponse {
  return_code: number; // 1: success, 2: failed, 3: processing
  return_message: string;
  sub_return_code: number;
  sub_return_message: string;
  is_processing: boolean;
  amount: number;
  zp_trans_id: number;
  discount_amount: number;
}

export async function queryOrderStatus(
  appTransId: string
): Promise<QueryOrderResponse> {
  const postData = {
    app_id: String(config.app_id),
    app_trans_id: appTransId,
    mac: "",
  };

  // MAC = HMAC(key1, app_id|app_trans_id|key1)
  const macData = [config.app_id, appTransId, config.key1].join("|");
  postData.mac = hmacSHA256(config.key1, macData);

  const response = await fetch(config.queryOrderEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(postData),
  });

  return response.json();
}
