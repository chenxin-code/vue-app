/**
 * Created by steven on 2018/12/29.
 */

import Loading from '../components/Vendor/Loading/index'
import messagebox from  '../components/Vendor/messagebox/index'
import  coupon from  '../components/mall2/common/coupon/index'
import  search from  '../components/mall2/common/search/index'
import  address from  '../components/mall2/common/address/index'
import  freight from  '../components/mall2/common/freight/index'
import  invoice from  '../components/mall2/common/invoice/index'
import  salepro from  '../components/mall2/common/salepro/index'
import  giftlist from  '../components/mall2/common/giftlist/index'
import  nostock from  '../components/mall2/common/no-stock/index'
import  pickupcode from  '../components/mall2/common/pickupcode/index'
import  pickupaddress from  '../components/mall2/common/pickup-address/index'
import Photo from '../components/commonui/choosephoto'

const closeAll = {
  close:function () {
    Loading.close();
    messagebox.close();
    coupon.close();
    search.close();
    address.close();
    freight.close();
    invoice.close();
    salepro.close();
    giftlist.close();
    nostock.close();
    pickupcode.close();
    pickupaddress.close();
    Photo.close();
  }

};
export default closeAll
