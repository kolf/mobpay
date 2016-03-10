/**
 * Created by Kolf on 16/3/2.
 */
const baseUrl = 'http://121.40.236.90:8102/'

export default {
  fetch (store) {
    return this.$http.get(baseUrl + 'accountinfoquery')
  }
}
