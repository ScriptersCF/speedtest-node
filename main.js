const download = require('download');
const { appendFile, unlinkSync } = require('fs');
const config = require('./configurations.json');
// 1MB = 8Mb
const size = 100 * 8;
let interval = 1000 * 3600;

function resetTimeout() {
    interval = Math.floor((Math.random() * 1801) + 1800) * 1000; // Generates an interval between 1 hour and 30 minutes
    setTimeout(main, interval); // Sets the loop to run with the newly generated interval
};

const main = async () => {
    let start = Date.now();
    let d = new Date();
    const href = config.href;
    const filePath = './';
    console.log('----------------');
    console.log(`Downloading ${href}`);
    await download(href); // Download the 100MB file, but don't save it
    let end = Date.now() - start;
    let mbps = Math.round(size / (end / 1000))
    await appendFile(`${config.logPath}/${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}.txt`, `[${d}] ${mbps} Mbps\n`, (err) => { // Append to log file, create one if there's none matching the current date.
        if (err) throw err;
    });
    console.clear();
    console.log('Finished download');
    console.log(`Measured speed: ${mbps} Mbps`);
    console.log(`Time in seconds: ${Math.round(end / 1000)} s`);
    console.log('\nWaiting for next download test...');
    resetTimeout();
};
main();
setTimeout(main, interval);
