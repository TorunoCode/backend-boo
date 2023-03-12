function checkTimeDifferenceMinute(time, timeCheck) {
    return ((timeCheck - time) / 1000) / 60
}
function getTodayAt0(time) {
    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    return new Date(time)
}
function getYesterdayAt0(time) {
    let todayAt0 = getTodayAt0(time)
    return new Date(todayAt0.setDate(todayAt0.getDate() - 1));
}
function getTomorrorAt0(time) {
    let todayAt0 = getTodayAt0(time)
    return new Date(todayAt0.setDate(todayAt0.getDate() + 1));
}
function getFirstDayOfMonth(time) {
    return new Date(time.getFullYear(), time.getMonth(), 1);
}
function getFirstDayOfLastMonth(time) {
    let firstDayOfMonth = getFirstDayOfMonth(time);
    return new Date(firstDayOfMonth.setMonth(firstDayOfMonth.getMonth() - 1));
}
function getFirstDayOfNextMonth(time) {
    let firstDayOfMonth = getFirstDayOfMonth(time);
    return new Date(firstDayOfMonth.setMonth(firstDayOfMonth.getMonth() + 1));
}
function getFirstDayOfThisYear(time) {
    return new Date(time.getFullYear(), 1, 1);
}
function getFirstDayOfNextYear(time) {
    let firstDayOfNextYear = getFirstDayOfThisYear(time)
    return new Date(firstDayOfNextYear.setFullYear(firstDayOfNextYear.getFullYear() + 1))
}
function getFirstDayOfWeek(time) {
    let todayAt0 = getTodayAt0(time)
    var day = todayAt0.getDay(),
        diff = todayAt0.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(todayAt0.setDate(diff));
}
function getFirstDayOfNextWeek(time) {
    let firstDayOfWeek = getFirstDayOfWeek(time)
    return new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 7))
}
function checkDateIsTodayOrNotYetOrPassedTime(time, timeCompared1, timeCompared2) {
    if (timeCompared1 <= time && time < timeCompared2) {
        return "Today";
    }
    if (time < timeCompared1) {
        return "Not Yet";
    }
    if (time >= timeCompared2) {
        return "Passed Time"
    }
}
function formatDate_YearMonthDay(time) {
    let month = ("0" + (time.getMonth() + 1)).slice(-2),
        day = ("0" + time.getDate()).slice(-2),
        year = time.getFullYear();
    return year + "-" + month + "-" + day;
}
export default {
    checkTimeDifferenceMinute, getYesterdayAt0, getFirstDayOfMonth, getFirstDayOfLastMonth,
    getFirstDayOfNextYear, getFirstDayOfThisYear, getTodayAt0, getTomorrorAt0,
    getFirstDayOfNextMonth, getFirstDayOfWeek, getFirstDayOfNextWeek, checkDateIsTodayOrNotYetOrPassedTime,
    formatDate_YearMonthDay
}