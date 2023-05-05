import billsModel from '../models/billsModel.js';
function convertValue(Revenue, Movies, sumOrders, sumUser) {
    let oneResult = {};
    let smallResult = [];
    try {
        oneResult["Revenue"] = Revenue[0].Revenue
    } catch (error) {
        oneResult["Revenue"] = 0
    }
    try {
        oneResult["Movies"] = Movies[0].count
    } catch (error) {
        oneResult["Movies"] = 0
    }
    try {
        oneResult["sumOrders"] = sumOrders[0].count
    } catch (error) {
        oneResult["sumOrders"] = 0
    }
    try {
        oneResult["sumUser"] = sumUser[0].count
    } catch (error) {
        oneResult["sumUser"] = 0
    }
    smallResult.push({ "icon": "bx bx-dollar-circle", "count": oneResult.Revenue + "$", "title": "Revenue" });
    smallResult.push({ "icon": "bx bx-receipt", "count": oneResult.sumOrders + "", "title": "orders" });
    smallResult.push({ "icon": "bx bx-user", "count": oneResult.sumUser + "", "title": "users" });
    smallResult.push({ "icon": "bx bx-film", "count": Movies, "title": "Movies" });
    return smallResult;
}
async function countRevenue(dayBegin, dayEnd) {
    let result = await billsModel.aggregate([{
        $match: {
            createdAt: {
                $gte: dayBegin,
                $lt: dayEnd
            }
        }
    }, { $group: { _id: null, Revenue: { $sum: "$totalMoney" } } }]);
    return result;
}
async function sumOrders(dayBegin, dayEnd) {
    let result = await billsModel.aggregate([{
        $match: {
            createdAt: {
                $gte: dayBegin,
                $lt: dayEnd
            }
        }
    }, { $group: { _id: "$_id" } }, { $group: { _id: 1, count: { $sum: 1 } } }])
    return result;
}
export default { convertValue, countRevenue, sumOrders }