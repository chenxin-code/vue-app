### 定制化开发
1. 开发目录 src/deploy
2. 文件名为 参考下方（打包文件名）
3. 目录结构 router, views
   - router 如果页面和产品一样，只是功能不一样，路由地址可以产品相同，打包时会替换掉产品路由
   - views 要开发的页面
4. 启动项目 npm run dev [打包文件名]

## 全局配置输入参数
> app_conf_detail配置  
### 加油卡绑定
```
- oilCardICCard （默认不填， 开启：1）
  说明：IC卡对账单
- oilCardBindPersonalEnabled （默认不填， 开启：1）
  说明：个人加油卡绑定开启新的绑定流程
- oilCardBindCompanyEnabled（默认不填， 开启：1）
  说明：单位加油卡绑定开启
- oilBindCompanySubCardEnabled (默认不填, 开启: 1)
  说明: 单位加油卡绑定副卡开启
- oilBindOtherProvincesCardEnabled (默认不填, 开启: 1)
  说明: 开启绑定外省加油卡
- oilCardVirtualPayEnabled (默认不填，1开启) 
  说明：是否开启加油卡充值虚拟支付
- oilShortName ('汽油,柴油') 
  说明：油品短名称
- card_bind_oilCardBindType_dlgAlertDays (默认不填，1开启) 
  说明：是否开启首页加油卡绑定弹框 
- oilPayPointDisabled (默认不填开启，值为1是禁用)
  说明：关闭无卡加油积分入口
- cardListOpenFlodFace (默认不填, 1开启)
  说明: 加油卡列表 全部展开
```
### 优惠券

```
- couponGroupMode （默认不填， 开启：1）
  说明：开启电子券 分组展示模式
```
### 小程序

```
- mpName
  说明：小程序名称
- empQrcodeDes
  推荐码页面说明描述。

```
### 发票

```
- invoiceEntryMenu   
  自助开票菜单(0 加油卡 1 APP 2 商城)

```
### 油站

```
- stationSortType   
  油站排序方式(默认不填：展示的排序距离为搜索地点附近油站， 1：展示的排序距离为用户定位地点到 搜索的油站)

```

{
"projectName":"有路营销平台",
// 客服电话
"customerService":"010-62669197",
"downloadBgImgUrl":"http://tbdwechat.deepermobile.com/download?uploadFile.id=34214",
"latitude":"28.6887544",
"logoUrl":"http://tbdwechat.deepermobile.com/download?uploadFile.id=34215",
"downloadImgUrl":"http://tbdwechat.deepermobile.com/download?uploadFile.id=34214",
"downloadName":"加油江西",
"shareTitle":"分享标题",
"technicalSupport":"北京尚博信科技有限公司",
 // 商户合作email
"merchantEmail":"business@sunboxsoft.com",
"shareDesc":"分享描述",
"wxBaseUrl":"http://tbdwechat.deepermobile.com",
"city":"南昌",
"district": "",
"province":"江西",
 // 商户合作电话
"merchantPhone":"010-62669197",
"loadingUrl":"http://tbdwechat.deepermobile.com/download?uploadFile.id=34216",
"longitude":"115.864767",
// 虚拟支付列表
"acctList":[{"displayUnit":"个","displayName":"员工钱包","priority":"3","startUsing":"true","acctType":"EmpRewards"},{"priority":"1","startUsing":"true","displayName":"积分","displayUnit":"分","acctType":"Points"},{"displayUnit":"个","displayName":"返利红包","priority":"2","startUsing":"true","acctType":"Rewards"}]}
```


### 打包文件名
```
base                    基础应用                        
ynsy                    云南石油       
jxsy                    江西石油              
bchd                    首发         
gdsy                    广东石油         
ahsy                    安徽石油        
djljy                   大家一起来加油    
hubeisy                 湖北石油        
hainansy                海南石油                  
henansy                 河南石油       
jilinsy                 吉林石油          
hunansy                 湖南石油
hebeisy                 河北石油（新）
hbsy                    河北石油（旧）
cnpchb                  中油好客
```
