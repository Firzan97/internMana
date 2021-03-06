const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const con = require('./connection');

const b = (async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.maukerja.my/?cat=462-it&jtype=1-Internship', { waitUntil: 'load' });
    // await page.waitForSelector('.result_text a');
    await page.setViewport({
        width: 1200,
        height: 800
    });

    await autoScroll(page);

    // Get the "viewport" of the page, as reported by the page.
    const data = await page.evaluate(() => {

        var names = document.querySelectorAll('.media-content .title a');
        var companies = document.querySelectorAll('.media-content .subtitle a');
        var links = document.querySelectorAll(".card-content > a");
        var locations = document.querySelectorAll('.card-content p .text-truncate-2-line');

        var name = Array.from(names, name => name.innerText)
        var company = Array.from(companies, company => company.innerText)
        var link = Array.from(links, link => link.href)
        var location = Array.from(locations, location => location.innerText)
        return { name, company, link, location }
    });

    console.log(data.name);
    console.log(data.company);
    console.log(data.link);
    console.log(data.location);



    // for (i = 0; i < a.length; i++) {
    //     var sql = "INSERT INTO job (name, company) VALUES ('" + a[i] + "'," + "'" + b[i] + "')";
    //     con.query(sql, function (err, result) {
    //         if (err) throw err;
    //         console.log("All jobs record inserted");
    //     });
    // }




    await browser.close();
})();


async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

module.exports = b;