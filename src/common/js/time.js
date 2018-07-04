import { formatTimeStamp } from './H5plugin'
export const filterTime = (timeList, nowTime)=>{
  let times = [];
  for (var i = 0,len = timeList.length; i < len; i++) {
    // 间隔15分钟的时间都没有的话，就排除掉
    if (timeList[i].startTime >= nowTime) {
      if (timeList[i].startTime > timeList[i].endTime - 900000) {
        continue
      } else {
        times.push({
          startTime: timeList[i].startTime,
          endTime: timeList[i].endTime,
          id: timeList[i].id
        })
      }
    } else if (
      timeList[i].startTime < nowTime &&
      timeList[i].endTime < nowTime
    ) {
      continue
    } else if (
      timeList[i].startTime < nowTime &&
      nowTime < timeList[i].endTime - 900000
    ) {
      times.push({
        startTime: timeList[i].startTime,
        endTime: timeList[i].endTime,
        id: timeList[i].id
      })
    }
  }
  return times;
}

export const disposeTime = (timeList) =>{
  let getDatas = []
  for (let i = 0; i < timeList.length; i++) {
    timeList[i].endTime -= 900000
  }
  let tempTimelist = []
  let tmObjective = timeList[0]
  if (timeList.length <= 1) {
    getDatas = [].concat(timeList)
    return getDatas
  }
  for (let i = 1; i < timeList.length; i++) {
    let newItem = {}
    let item = timeList[i]
    if (
      tmObjective.endTime >= item.startTime &&
      item.endTime >= tmObjective.endTime
    ) {
      newItem.startTime = tmObjective.startTime
      newItem.endTime = item.endTime
      if (i > 0) {
        tempTimelist.pop(tempTimelist[tempTimelist.length - 1])
      }
      tempTimelist.push(newItem)
      tmObjective.startTime = newItem.startTime
      tmObjective.endTime = newItem.endTime
    } else if (
      tmObjective.endTime >= item.startTime &&
      item.endTime < tmObjective.endTime
    ) {
      newItem.startTime = tmObjective.startTime
      newItem.endTime = tmObjective.endTime
      if (i > 0) {
        tempTimelist.pop(tempTimelist[tempTimelist.length - 1])
      }
      tempTimelist.push(newItem)
      tmObjective.startTime = newItem.startTime
      newItem.endTime = tmObjective.endTime
    } else {
      tempTimelist.push(item)
      tmObjective.startTime = item.startTime
      tmObjective.endTime = item.endTime
    }
  }
  getDatas = [].concat(tempTimelist)
  return getDatas
}

export const dataChange = (timeList, nowTime)=>{
  let arrayHoursMiunt = []
  console.log(timeList)
  for (var i = 0; i < timeList.length; i++) {
    let item = timeList[i]
    var n = (item.endTime - item.startTime) / 900000
    if (nowTime > item.endTime) {
      continue // 比结束时间都还大，直接结束本次循环
    } else if (
      item.startTime < nowTime &&
      nowTime < item.endTime
    ) {
      var x = null
      var start = item.startTime
      var arr = []
      for (var j = 0; j <= n; j++) {
        arr.push(start)
        start += 900000
      }
      for (var y = 0; y < arr.length; y++) {
        if (nowTime < arr[y]) {
          x = y
          break
        }
      }
      var arrtrue = []
      if (x !== null) {
        arrtrue = arr.slice(x)
        arrayHoursMiunt.push(arrtrue)
      }
    } else {
      // 先转换成数组
      var arr = []
      var start = timeList[i].startTime
      for (var j = 0; j <= n; j++) {
        arr.push(start)
        start += 900000
      }
      arrayHoursMiunt.push(arr)
    }
  }
  return convertTime(arrayHoursMiunt)
}

// 赋值 和 拆分 小时数
export const convertTime = (array)=>{
  var pData1 = [],pData2 = {}, pData2arr = []
  for (var i = 0; i < array.length; i++) {
    var arrayone = array[i]
    // 2018-12-12 12:12:12:00
    let oldDay = formatTimeStamp(arrayone[0]).substr(8, 2)
    for (var j = 0; j < arrayone.length; j++) {
      let time = formatTimeStamp(arrayone[j])
      let miunte = time.substr(14, 2)
      let hours = time.substr(11, 2)
      let day = time.substr(8, 2)  
      if (oldDay < day) {
        hours = ' 次日 ' + hours + ' 时 '
        miunte = miunte + ' 分 '
      } else {
        hours = hours + ' 时 '
        miunte = miunte + ' 分 '
      }
      if (pData1.length >= 1) {
        if (pData1[pData1.length - 1].texts != hours) {
          pData1.push({
            text: hours,
            value: i + j + hours,
            texts: hours,
            time: arrayone[j]
          })
        }
      } else {
        pData1.push({
          text: hours,
          value: i + j + hours,
          texts: hours,
          time: arrayone[j]
        })
      }

      pData2arr.push({
        text: miunte,
        value: i + j,
        texts: hours,
        time: arrayone[j]
      })
    }
  }
  var hoursarray = pData1
  var miuntearray = pData2chang (pData2arr)
  console.log(pData1)
  for (var i = 0; i < hoursarray.length; i++) {
    pData2[hoursarray[i].value] = miuntearray[hoursarray[i].text]
  }
  console.log(pData2);
  // this.$set(this.pickData2, 'pData1', hoursarray)
  // this.$set(this.pickData2, 'pData2', pData2)

  // this.pickData2.default.push(hoursarray[0])
  // this.pickData2.default.push(pData2[hoursarray[0].value][0])
  let defaultTime = hoursarray[0].text.substring(0, hoursarray[0].text.length - 2) + ':' + pData2[hoursarray[0].value][0].text.substring(0,pData2[hoursarray[0].value][0].text.length - 2) +'前'
  // 通过时间戳差值，获取价格信息
  console.log(new Date().getTime())
  let priceTime = hoursarray[0].time - new Date().getTime()
  // this.getPrice(this.priceTime)
  // this.getDefaultTime(hoursarray[0].time)
  return { pData1: hoursarray, pData2: pData2, default: [hoursarray[0], pData2[hoursarray[0].value][0]], defaultTime: defaultTime, priceTime: priceTime }
}
export const pData2chang = (arr) =>{
    var data = []
    for (var i = 0; i < arr.length; i++) {
      if (!data[arr[i].texts]) {
        var arrs = []
        arrs.push(arr[i])
        data[arr[i].texts] = arrs
      } else {
        data[arr[i].texts].push(arr[i])
      }
    }
    return data
}
