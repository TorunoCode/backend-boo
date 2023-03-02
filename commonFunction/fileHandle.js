import fs from 'fs';
import path from 'path';
function template3Notification(responseBody) {
    var subHtml = fs.readFileSync(path.join(path.resolve(process.cwd(), "template"), 'mailreceipt3.html'), 'utf8')
    subHtml = subHtml.replace('responseBody', responseBody)
    return subHtml;
}
function template4Notification(responseBody) {
    var subHtml = fs.readFileSync(path.join(path.resolve(process.cwd(), "template"), 'mailreceipt4.html'), 'utf8')
    subHtml = subHtml.replace('responseBody', responseBody)
    return subHtml;
}
export default { template3Notification, template4Notification }