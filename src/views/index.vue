<template>
  <div class="app">
    <div class="app-header"><span @click="back" class="prev"></span>融数支付</div>
    <div class="app-content" v-show="!showLoad">
      <ul class="list">
        <li class="item item-divider text-center">
          <i></i><span>您正在安全支付环境中，请放心支付</span>
        </li>
        <li class="item item-content text-center ui-border-tb">
          <h4>付款金额</h4>
          <h2>{{query.amount/100}}元</h2>
        </li>
        <li class="item v-list">
          <p><span>{{query.merchantName}}</span>收款方</p>
          <p><span>{{query.userorderid}}</span>订单编号</p>
        </li>
        <li class="item bg-while ui-border-tb" v-if="accountinfo">
          {{accountinfo.bankheadname}}({{accountinfo.account_number}})
        </li>
        <li class="item bg-while ui-border-tb" v-else>
          您尚未绑定银行卡，请先绑定银行卡
        </li>
      </ul>
      <div class="pad">
        <div class="btn btn-block" @click="pay" v-if="accountinfo">
          去支付
        </div>
        <div v-else class="btn btn-block" v-link="'binding'" v-else>
          去绑定
        </div>
      </div>
    </div>
    <Loading :show.sync="showLoad"></Loading>
    <Toast :show.sync="showLoading" :time="5000">请求中...</Toast>
    <Toast :show.sync="showAlert" :callback="back">信息被修改...</Toast>
  </div>
</template>
<style lang="scss">
  .item-content h2 {
    font-size: 40px;
    padding: 15px 0 10px 0;
    color: #e42112;
  }

  .v-list {

    span {
      float: right;
    }

    p {
      padding: 3px 0;
    }

  }
  .item-divider {
    height: 42px;
  }

  .item-divider i {
    display: inline-block;
    margin-right: 5px;
    width: 20px;
    height: 20px;
    background: url("../assets/logo.png") no-repeat;
    background-size: 20px auto;
  }

  .item-divider span {
    position: relative;
    top: -6px;
  }
</style>
<script>
  //  import store from '../store/index'
  import Loading from '../components/loading'
  import Toast from '../components/toast'

  export default {
    components: {
      Loading,
      Toast
    },
    data () {
      return {
        query: this.$route.query,
        showLoad: true,
        showLoading: false,
        showAlert: false
      }
    },
    methods: {
      back () {
        window.localStorage.clear()
        window.history.back()
      },
      pay () {
        this.$set('showLoading', true)
        this.savewithcard().then(function (data) {
          data = data.data
          if (data.result === 'ok') {
            this.$set('accountinfo.orderid', data.data.wheatfield_order_save_withcard_response.orderid)
            this.CheckSignOrder()
          } else if (data.result === 'error') {
            console.log(data.msg)
          }
        })
      },
      accountinfoquery () {  // 查询绑卡信息
        var accountinfo = window.localStorage.getItem('accountinfo')
        console.log(accountinfo)
        if (accountinfo) {
          console.log(accountinfo)
          this.$set('showLoad', false)
          this.$set('accountinfo', window.JSON.parse(accountinfo))
          return
        }
        this.$http.get('accountinfoplusquery', {
          userid: this.query.userid,
          usertype: '2',
          constid: this.query.rootinstcd,
          productid: this.query.productid,
          objorlist: '1',
          platformType: '3'
        }).then(function (data) {
          data = data.data
          this.$set('showLoad', false)

          if (data.result === 'ok') {
            this.$set('accountinfo', data.data.wheatfield_accountinfoplus_query_response.accountinfopluss.accountinfoplus[0])
          }
        })
      },
      savewithcard () {  // 落单
        return this.$http.get('savewithcard', {
          ordertypeid: 'BX1',
          userid: this.query.userid,
          constid: this.query.rootinstcd,
          productid: this.query.productid,
          ordertime: this.query.ordertime,
          userorderid: this.query.userorderid,
          amount: this.query.amount,
          accountnumber: this.accountinfo.account_number,
          accounttypeid: '00',
          bankheadname: this.accountinfo.bankheadname,
          currency: 'CNY',
          accountpurpose: '1',
          accountproperty: '1',
          certificatetype: '0',
          certificatenumber: this.accountinfo.certificatenumber,
          accountname: this.accountinfo.accountrealname,
          mobile: this.query.mobile,
          registerTime: this.query.registerTime,
          bankhead: this.accountinfo.bankhead,
          platformType: '3'
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        })
      },
      payOrder () {
        this.$http.get('payOrder', {
          platformType: '3',
          params: JSON.stringify({
            mobile: this.query.mobile,
            registerTime: this.query.registerTime,
            merchantNo: this.query.rootinstcd,
            userId: this.query.userid,
            notifyUrl: this.query.notifyUrl,
            payerAccountName: this.accountinfo.account_number,
            userNo: this.accountinfo.certificatenumber,
            orderNo: this.accountinfo.orderid,
            orderAmount: this.query.amount,
            amtType: 'CNY',
            payType: '24',
            bankCode: this.accountinfo.bankhead,
            orderMark: '1',
            orderTime: this.query.ordertime,
            payerAccountNo: this.accountinfo.account_number,
            expend: this.query.userorderid
          })
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        }).then(function (data) {
          this.CheckSignOrder()
        })
      },
      CheckSignOrder () {
        this.$http.get('CheckSignOrder', {
          productid: this.query.productid,
          rootinstcd: this.query.rootinstcd,
          platformType: '3',
          jsonParam: encodeURIComponent('merchantNo=' + this.query.rootinstcd + '&orderNo=' + this.accountinfo.orderid + '&orderAmount=' + this.query.amount + '&payType=23&orderTime=' + this.query.ordertime.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '') + '&signType=1&version=v1.0&key=')
        }).then(function (data) {
          window.localStorage.clear()
          data = data.data.data
          window.location.href = 'http://devrsjf.rongcapital.com.cn:8486/checkstand/payment?merchantNo=' + this.query.rootinstcd + '&productNo=' + this.query.productid + '&orderNo=' + this.accountinfo.orderid + '&payType=23&orderAmount=' + this.query.amount + '&amtType=01&notifyUrl=http://121.40.236.90:8102/receiveGatewayNotice&pageUrl=' + this.query.backUrl + '&orderTime=' + this.query.ordertime.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '') + '&orderMark=1&signType=1&busiCode=101&version=v1.0&charset=1&signMsg=' + data
        })
      }
    },
    route: {
      data () {
        this.$http.get('CheckSignOrder', {
          'jsonParam': toStr(this.query),
          'productid': this.query.productid,
          'rootinstcd': this.query.rootinstcd
        }).then(function (data) {
          data = data.data.data
          if (data === this.query.MISC) {
            this.accountinfoquery()
            console.log(this.$parent.root)
          } else {
            this.showAlert = true
          }
        })

        function toStr (data) {
          var str = ''
          str = data.ordertime + data.productid + data.rootinstcd + data.userid + data.userorderid + data.userrelateid + data.amount + data.unitprice
          return str
        }
      }
    }
  }
</script>

