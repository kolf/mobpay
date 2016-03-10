import utils from './utils'

exports.getLastTimeStr = (time, fromnow) => {
  var UnixTimeStamp = new Date(time * 1000)
  if (fromnow) {
    return utils.MillisecondToDate(new Date() - new Date(UnixTimeStamp))
  } else {
    return utils.fmtDate(new Date(UnixTimeStamp), 'yyyy-MM-dd hh:mm')
  }
}
