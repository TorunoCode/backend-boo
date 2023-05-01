import https from 'https'
async function getJsonData(hostname, port, path, method) {
    let options = {
        hostname: hostname,
        path: path,
        method: method,
    };
    if (port != null) {
        options = Object.assign(options, { port: port })
    }
    let dataToUse = await new Promise((resolve, reject) => {
        https.get(options, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(JSON.parse(data));
            });

        }).on("error", (err) => {
            reject(err)
        });
    });
    return dataToUse
}
export default { getJsonData }