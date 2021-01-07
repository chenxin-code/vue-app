const riseUrl = '/app/json/user_invoice_assistant/queryUserInvoiceHeadList' // 发票抬头列表
const openedUrl = '/app/json/user_invoice_assistant/queryInvoicedList' // 已开发票列表
const detailUrl = '/app/json/user_invoice_assistant/queryInvoiceDetails' // 已开发票详情
const commitUrl = '/app/json/user_invoice_assistant/addOrUpdateUserInvoiceHead' // 添加和修改发票抬头的保存
const delUrl = '/app/json/user_invoice_assistant/deleteUserInvoiceHead' // 删除抬头
const morenUrl = '/app/json/user_invoice_assistant/setDefaultUserInvoiceHead' // 删除抬头
const souUrl = '/app/json/user_invoice_assistant/searchInvoiceList' // 搜索抬头列表
const soudetailUrl = '/app/json/user_invoice_assistant/queryUserInvoiceHeadDetails' // 搜索玩，进入抬头详情
const tijiaoUrl = '/app/json/user_invoice_assistant/addInvoicing' // 申请开具发票提交接口
const saoUrl = '/app/json/user_invoice_assistant/getResultFromQrcode' // 扫码进来的详情
const morentitleUrl = '/app/json/user_invoice_assistant/queryDefaultTittle' // 默认发票抬头
const daikaiUrl = '/app/json/user_invoice_assistant/unInvoicingList' // 代开发票列表
const chakanUrl = '/app/json/user_invoice_assistant/queryUserInvoiceHeadDetails' // 查看已开发票
const histroyUrl = '/app/json/user_invoice_assistant/queryInvoicedList' // 历史开票列表
const histroydetailDataUrl = '/app/json/user_invoice_assistant/queryInvoiceDetails' // 历史开票详情
const emailUrl = '/app/json/user_invoice_assistant/invoiceModifyMailbox' // 修改邮箱
const commitselfinvoiceUrl = '/app/json/user_invoice_assistant/orderInvoicingInMall' // 自助开票的提交--商品和加油订单
const commitselfcardinvoiceUrl = '/app/json/user_invoice_assistant/gasCardInvoice' // 自助开票的提交--加油卡
const appUrl = '/app/json/refuel_center/queryOrder' // app 加油订单列表
const mallUrl = '/app/json/app_shopping_order/queryOrder' // 商城订单列表
const goldUrl = '/app/json/user_invoice_assistant/queryCashIn' // 加油金订单列表
const walletUrl ='/app/json/user_invoice_assistant/sinopecWalletInvoiceList' //石化钱包加油订单列表
const cardUrl = '/app/json/user_invoice_assistant/queryUserRefuelingCardInfoList' // 加油卡订单列表
const storeUrl = '/app/json/user_invoice_assistant/queryConvenienceStoreOrder' // 便利店列表
const hisUrl = '/app/json/user_invoice_assistant/invoiceContentDetailsList' // 开票历史明细列表
const hisdetailUrl = '/app/json/user_invoice_assistant/invoiceContentDetails' // 开票历史明细列表详情
const mingxiUrl = '/app/json/user_invoice_assistant/detailsOfInvoiceList' // 商城和加油订单发票内容明细列表
const malldetailUrl = '/app/json/app_shopping_order/detail' // 商城订单发票内容明细列表详情
const shopdetailUrl = '/app/json/user_invoice_assistant/convenienceStoredetail' // 便利店订单发票内容明细列表详情
const oildetailUrl = '/app/json/refuel_center/detail' // 加油订单发票内容明细列表详情
const golddetailUrl = '/app/json/user_invoice_assistant/detailsOfInvoiceInfo' // 现金订单发票内容明细列表详情
const cardMoUrl = '/app/json/card/getUserCardList' // 加油卡号列表
const invoicetipUrl = '/app/json/news/getNewsList' // 自助开票提示
const refundUrl = '/app/json/user_invoice_assistant/invoiceRushRed' // 退票
const commitselfgoldinvoiceUrl = '/app/json/user_invoice_assistant/cashInInvoicing' // 加油金开票
const exportinvoiceUrl = '/app/json/user_invoice_assistant/importUserInvoiceHead' // 微信发票导入
export default {
  methods: {
    exportinvoiceData(params) {
      return this.$http.post(exportinvoiceUrl, params)
    },
    golddetailData(params) {
      return this.$http.post(golddetailUrl, params)
    },
    invoicetipData(params) {
      return this.$http.post(invoicetipUrl, params)
    },
    refundData(params) {
      return this.$http.post(refundUrl, params)
    },
    cardMoData(params) {
      return this.$http.post(cardMoUrl, params)
    },
    mingxiData(params) {
      return this.$http.post(mingxiUrl, params)
    },
    malldetailData(params) {
      return this.$http.post(malldetailUrl, params)
    },
    shopdetailData(params) {
      return this.$http.post(shopdetailUrl, params)
    },
    oildetailData(params) {
      return this.$http.post(oildetailUrl, params)
    },
    hisdetailData(params) {
      return this.$http.post(hisdetailUrl, params)
    },
    hisData(params) {
      return this.$http.post(hisUrl, params)
    },
    mallData(params) {
      return this.$http.post(mallUrl, params)
    },
    storeData(params) {
      return this.$http.post(storeUrl, params)
    },
    appData(params) {
      return this.$http.post(appUrl, params)
    },
    goldData(params) {
      return this.$http.post(goldUrl, params)
    },
    walletData(params) {
      return this.$http.post(walletUrl, params)
    },
    cardData(params) {
      return this.$http.post(cardUrl, params)
    },
    commitselfinvoiceData(params) {
      return this.$http.post(commitselfinvoiceUrl, params)
    },
    commitselfcardinvoiceData(params) {
      return this.$http.post(commitselfcardinvoiceUrl, params)
    },
    commitselfgoldinvoiceData(params) {
      return this.$http.post(commitselfgoldinvoiceUrl, params)
    },
    emailData(params) {
      return this.$http.post(emailUrl, params)
    },
    histroydetailData(params) {
      return this.$http.post(histroydetailDataUrl, params)
    },
    histroyData(params) {
      return this.$http.post(histroyUrl, params)
    },
    riseData(params) {
      return this.$http.post(riseUrl, params)
    },
    openedData(params) {
      return this.$http.post(openedUrl, params)
    },
    commitData(params) {
      return this.$http.post(commitUrl, params)
    },
    delData(params) {
      return this.$http.post(delUrl, params)
    },
    morenData(params) {
      return this.$http.post(morenUrl, params)
    },
    detailData(params) {
      return this.$http.post(detailUrl, params)
    },
    souData(params) {
      return this.$http.post(souUrl, params)
    },
    soudetailData(params) {
      return this.$http.post(soudetailUrl, params)
    },
    tijiaoData(params) {
      return this.$http.post(tijiaoUrl, params)
    },
    saoData(params) {
      return this.$http.post(saoUrl, params)
    },
    morentitleData(params) {
      return this.$http.post(morentitleUrl, params)
    },
    daikaiData(params) {
      return this.$http.post(daikaiUrl, params)
    },
    chakanData(params) {
      return this.$http.post(chakanUrl, params)
    },
  }
}
