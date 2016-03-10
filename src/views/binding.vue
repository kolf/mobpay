<template>
  <div class="app">
    <div class="app-header"><span v-link="'index'" class="prev"></span>融数支付</div>
    <div class="app-content" v-show="!showLoad">
      <validator name="form">
        <form novalidate>
          <div class="list">
            <div class="item item-divider">请绑定持卡人本人的银行卡</div>
            <div class="bg-while">
              <div class="item item-input">
                <span class="input-label">持卡人</span>
                <input type="text" v-model="users.name" placeholder="请绑定持卡人本人的银行卡"
                       v-validate:name="{ required: true, minlength: 2, maxlength: 5, name:true }"/>
                <i v-if="$form.name.required" class="fa fa-info-circle input-tips" @click="showAlert=true"></i>
                <i v-if="$form.name.valid" class="fa fa-check-circle input-tips"></i>
                <i v-if="!$form.name.required && !$form.name.valid" class="fa fa-times-circle input-tips"
                   @click="users.name=''"></i>
              </div>
              <div class="item item-input ui-border-t">
                <span class="input-label">银行卡号</span>
                <input type="text" placeholder="请填写银行卡号" v-model="users.cardNumber"
                       v-validate:card-number="{ required: true, cardNumber:true}">
                <i v-if="$form.cardNumber.valid" class="fa fa-check-circle input-tips"></i>
                <i v-if="!$form.cardNumber.required && !$form.cardNumber.valid" class="fa fa-times-circle input-tips"
                   @click="users.cardNumber=''"></i>
              </div>
              <div class="item item-input ui-border-t">
                <span class="input-label">证件号</span>
                <input type="text" placeholder="请填写证件号" v-model="users.idNumber"
                       v-validate:id-number="{ required: true, idNumber:true}">
                <i v-if="$form.idNumber.valid" class="fa fa-check-circle input-tips"></i>
                <i v-if="!$form.idNumber.required && !$form.idNumber.valid" class="fa fa-times-circle input-tips"
                   @click="users.idNumber=''"></i>
              </div>
              <div class="item item-input ui-border-t">
                <span class="input-label">开户行</span>
                <select v-validate:bank-list="{required:true}" v-model="users.bank">
                  <option value="">请选择开户行</option>
                  <option v-for="bank in bankList" :value="bank.bankcode">{{bank.bankname}}</option>
                </select>
              </div>
            </div>
            <label class="item">
              <input type="checkbox" class="checkbox" v-validate:agreement="{required:true}">
              同意 <span class="text-primary" v-link="'agreement'">用户协议</span>
            </label>
          </div>
          <div class="pad">
            <div class="btn btn-block" :class="{disabled:!$form.valid}" @click.prevent="submit($form.valid)">
              下一步
            </div>
          </div>
        </form>
      </validator>
    </div>
    <alert :show.sync="showAlert" title="持卡人说明">为了你的账户资金安全，只能绑定持卡人本人的银行卡。</alert>
    <Toast :show.sync="showToast" :duration="3000">绑定成功...</Toast>
    <Loading :show.sync="showLoad"></Loading>
    <Toast :show.sync="showLoading" :duration="5000">正在请求中...</Toast>
  </div>
</template>
<script>
  import Alert from '../components/alert'
  import Toast from '../components/toast'
  import Loading from '../components/loading'

  export default {
    components: {
      Alert,
      Toast,
      Loading
    },
    validators: {
      name: function (val) {
        return /^([\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*)$/.test(val)
      },
      cardNumber: function (val) {
        return /^(\d{16,19})$/.test(val)
      },
      idNumber: function (val) {
        return /(^\d{17}([0-9]|X)$)/i.test(val)
      }
    },
    data () {
      return {
        query: this.$route.query,
        showAlert: false,
        showToast: false,
        showLoad: true,
        showLoading: false,
        users: {
          name: '石先康',
          cardNumber: '6212260200078831738',
          idNumber: '42022219901002323x',
          bank: ''
        }
      }
    },
    methods: {
      submit (valid) {
        if (valid) {
          window.localStorage.setItem('accountinfo', JSON.stringify({
            account_number: this.users.cardNumber,
            bankheadname: this.getBankname(this),
            certificatenumber: this.users.idNumber,
            accountrealname: this.users.name,
            bankhead: this.users.bank
          }))

          this.$route.router.go('index')
        }
      },
      getBindingCard () {
        this.showLoad = false
        this.$http.get('bindingCardQuery', {
          payway: '1',
          channelCode: '10002',
          platformType: '3'
        }).then(function (data) {
          data = data.data

          if (data.result === 'ok') {
            this.$set('bankList', data.data.wheatfield_bankn_query_response.bankinfos.bankinfo)
          }
        })
      },
      getBankname (data) {
        var backList = data.bankList
        var backcode = data.users.bank
        for (var i = 0; i < backList.length; i++) {
          if (backList[i].bankcode === backcode) {
            return backList[i].bankname
          }
        }
      }
    },
    ready () {
      this.getBindingCard()
    }
  }
</script>
