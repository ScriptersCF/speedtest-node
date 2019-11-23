const download = require('download');
const { appendFile } = require('fs');
const config = require('./configurations.json');
let interval = 1000 * 3600;
let href = config.default_href;

let mbps;
function resetTimeout() {
    interval =  Math.floor((Math.random() * 1801) + 1800) * 1000; // Generates an interval between 1 hour and 30 minutes
    if (mbps >= 10) {
        href = config.decent_href;
        
        if (mbps >= 30) {
            href = config.fast_href;
        }

        if (mbps >= 100) {
            href = config.superfast_href;
        }
    }
    setTimeout(main, interval); // Sets the loop to run with the newly generated interval
};

const main = async () => {
    let size = parseInt(href.toString().slice(27, href.toString().length - 6)) * 8;
    let start = Date.now();
    let d = new Date();
    console.log('------------------');
    console.log(`Downloading ${href}`);
    await download(href); // Download the file, but don't save it
    let end = Date.now() - start;
    mbps = size / (end / 1000);
    await appendFile(`${config.logPath}/${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}.txt`, `[${d}] ${mbps} Mbps\n`, (err) => { // Append to log file, create one if there's none matching the current date.
        if (err) throw err;
    });
    console.clear();
    console.log('Finished download');
    console.log(`Measured speed: ${mbps.toFixed(2)} Mbps`);
    console.log(`Time in seconds: ${(end / 1000).toFixed(2)} s`);
    console.log('\nWaiting for next download test...');
    resetTimeout();
};
main();
setTimeout(main, interval);
