
const download = require('download');
const fs = require('fs');
// 1MB = 8Mb
const size = 100 * 8;
let interval = 1000 * 3600;


setInterval(async() => {
    let start = Date.now();
    let d = new Date();
    console.log('-----------------');
    console.log('Started download');
    const href = 'https://speed.hetzner.de/100MB.bin';
    const filePath = './';
    await download(href, filePath);
    let end = Date.now() - start;
    let mbps = Math.round(size / (end / 1000))
    await fs.appendFile(`./log/${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}.txt`, `[${d}] ${mbps} Mbps\n`, (err) => {
        if (err) throw err;
    });
    console.clear();
    console.log('Finished download');
    console.log(`Measured speed: ${mbps} Mbps`);
    console.log(`Time in seconds: ${Math.round(end / 1000)} s`);
    fs.unlinkSync(`${filePath}/100MB.bin`);
}, interval);

