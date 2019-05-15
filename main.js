const download = require('download');
const { appendFile, unlinkSync } = require('fs');
const { logPath } = require('./configurations.json');
// 1MB = 8Mb
const size = 100 * 8;
let interval = 1000 * 3600;

const main = async () => {
    function stopInterval() {
        clearInterval(loop); // Stops the loop
        interval = Math.floor((Math.random() * 3601) + 1800) * 1000; // Generates a interval between 1 hour and 30 minutes
        loop = setInterval(main, interval); // Sets the loop to run with the newly generated interval
    }
    
    let start = Date.now();
    let d = new Date();
    console.log('----------------');
    console.log('Started download');
    const href = 'https://speed.hetzner.de/100MB.bin';
    const filePath = './';
    await download(href, filePath); // Download the 100MB.bin file
    let end = Date.now() - start;
    let mbps = Math.round(size / (end / 1000))
    await appendFile(`${logPath}/${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}.txt`, `[${d}] ${mbps} Mbps\n`, (err) => { // Append to log file, create one if there's none matching the current date.
        if (err) throw err;
    });
    console.clear();
    console.log('Finished download');
    console.log(`Measured speed: ${mbps} Mbps`);
    console.log(`Time in seconds: ${Math.round(end / 1000)} s`);
    unlinkSync(`${filePath}/100MB.bin`); // Delete the downloaded file
    console.log('\nWaiting for next download test...');
    stopInterval();
};
main();
let loop = setInterval(main, interval);
