const redDays = ['2023-01-01'
            ,'2023-01-21'
            ,'2023-01-22'
            ,'2023-01-23'
            ,'2023-01-24'
            ,'2023-03-01'
            ,'2023-05-05'
            ,'2023-05-27'
            ,'2023-06-06'
            ,'2023-08-15'
            ,'2023-09-28'
            ,'2023-09-29'
            ,'2023-09-30'
            ,'2023-10-03'
            ,'2023-10-09'
            ,'2023-12-25'];

// Your JavaScript code here

$(document).ready(function() {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear()+1, 0, 0); // 올해말
    $("#date-from").val(formatDate(today));
    $("#date-to").val(formatDate(startOfYear));
    $("#ramainTakeOff").on("input", function() {
    $('tbody tr').not(':has(th)').remove();
    let fromDate = dayToNum($("#date-from").val())
    let toDate = dayToNum($("#date-to").val())
    let getThisYear = new Date($("#date-from").val());
    let result = search($("#ramainTakeOff").val(), getThisYear.getFullYear(), fromDate, toDate);

    //시작일 요일 - 숫자만큼추가
    //끝나는 요일 - 6-x만큼 추가

    var renderCnt = 6 - getDayOfWeek(result.end) + getDayOfWeek(result.start) + result.maxRestDays; // 달력에 그려줄 날짜갯수
    var trId = '';
    startDate = new Date(result.start)
    startDate.setDate(startDate.getDate() - getDayOfWeek(result.start));

    for (var i = 0; i < renderCnt ; i++){
    if ((i+6)%7 == 6){
      trId = 'week'+ ((i+7)/7);
      let $tr = $('<tr>',{id : trId});
      $("#tbody").append($tr);
    }
    // 현재 날짜를 startDate에 복사합니다.
    var currentDate = new Date(startDate);

    // startDate의 날짜에 i일을 더합니다.
    currentDate.setDate(startDate.getDate() + i);

    if(getDayOfWeek(currentDate) == 0 || getDayOfWeek(currentDate) == 6 || redDays.indexOf(formatDate(currentDate)) != -1){
      $("#"+trId).append($('<td>',{text : (currentDate.getMonth()+1)+'/'+currentDate.getDate(), class : "red"}))
      console.log(currentDate)
    }else if (result.restDayList.indexOf(formatDate(currentDate)) != -1){
      $("#"+trId).append($('<td>',{class : "blue", text : (currentDate.getMonth()+1)+'/'+currentDate.getDate()}))
    }
    else{
      $("#"+trId).append($('<td>',{text : (currentDate.getMonth()+1)+'/'+currentDate.getDate()}))
    }
    
    }
    $("#console").text("와~~!"+$("#ramainTakeOff").val()+"일 연차써서 "+result.maxRestDays + "일 쉴 수 있다!!");
    console.log(result);
  });
});

function getDayOfWeek(dateString) {
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return dayIndex; // 일 - 0
}

function fnAddRedDay(){
  redDays.push($("#addRedDay").val());
  $("#addRedDay").val('')
}

function dayToNum(dateString) {
  const date = new Date(dateString);
  const startOfYear = new Date(date.getFullYear(), 0, 1); // 해당 연도의 1월 1일
  const differenceInTime = date - startOfYear;
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
  return differenceInDays + 1;
}


function getMonthDates(year) {
  let dates = [];
  let redDaysString = '';
  let result = [];
  for (let date = new Date(year, 0 , 1); date <= new Date(year+1, 0 , 0); date.setDate(date.getDate() + 1)) {
    const day = date.getDay();
    if(day.toString() == 0 || day.toString() == 6 || redDays.indexOf(formatDate(date)) != -1){
      redDaysString += '1';
    } else{
      redDaysString += '0';
    }
    dates.push(formatDate(date));
  }
  result[0] = dates;
  result[1] = redDaysString;
  console.log(result);
  return result;
}


function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function search(useRestDays, year, fromDate, toDate){
  let dayInfo = getMonthDates(year);
  let dates = dayInfo[0];
  let redDaysString = dayInfo[1];
  let maxRestDays = 0;
  var startDate = 0;
  var endDate = 0;
  let restDayList;
  for(var startDay = fromDate; startDay<Math.min(toDate-maxRestDays,redDaysString.length-maxRestDays); startDay++){
    let tempRestDayList = [];
    let restDays = 0;
    let remainRestDays = useRestDays;
    while(remainRestDays>0 || redDaysString[startDay + restDays]==1){
          if(redDaysString[startDay + restDays]==0){
            remainRestDays = remainRestDays - 1; // 평일이면 연차사용
            tempRestDayList.push(formatDate(new Date(year, 0, startDay + restDays +1 )));
          } 
          restDays = restDays + 1;  // 쉬는날
    }
    if (restDays > maxRestDays){
      maxRestDays = restDays;
      startDate = startDay;
      endDate = startDate + maxRestDays - 1;
      restDayList = JSON.parse(JSON.stringify(tempRestDayList));
    }
  }
  result = {start : dates[startDate], end : dates[endDate], maxRestDays : maxRestDays, restDayList : restDayList };
  return result;

}
