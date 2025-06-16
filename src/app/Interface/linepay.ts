/** 付款網址（Web / App） */
export interface PaymentUrl {
  /** 瀏覽器跳轉用 */
  web: string;
  /** 行動裝置 App 內開啟用 */
  app: string;
}

/** 後端 POST /payment/request 回傳的 data 物件 */
export interface LinePayRequestInfo {
  /** 你的 tPayments.PaymentID */
  paymentId: number;
  /** LINE Pay 回傳的 transactionId */
  transactionId: number;
  /** 兩種跳轉網址 */
  paymentUrl: PaymentUrl;
}
