function largestDemical(money1, money2) {
    let demicalCount
    let demicalCount2
    if (Math.floor(money1) === money1) {
        demicalCount = 0
    }
    else {
        demicalCount = money1.toString().split(".")[1].length || 0;
    }
    if (Math.floor(money2) === money2) {
        demicalCount2 = 0
    }
    else {
        demicalCount2 = money2.toString().split(".")[1].length || 0;
    }
    let demicalCountUse;
    if (demicalCount > demicalCount2) {
        demicalCountUse = demicalCount
    }
    else {
        demicalCountUse = demicalCount2
    }
    return demicalCountUse
}
function addMoney(money1, money2) {
    let demicalCountUse = largestDemical(money1, money2)
    let demicalResult = 10 ** demicalCountUse
    let result = money1 * demicalResult + money2 * demicalResult
    result = result / demicalResult
    return result;
}
function subtractionMoney(money1, money2) {
    let demicalCountUse = largestDemical(money1, money2)
    let demicalResult = 10 ** demicalCountUse
    let result = money1 * demicalResult - money2 * demicalResult
    result = result / demicalResult
    return result;
}
export default { addMoney, subtractionMoney }