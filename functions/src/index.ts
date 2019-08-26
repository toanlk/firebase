import * as functions from 'firebase-functions';
import * as puppeteer from 'puppeteer';

export const helloWorld = functions.region('asia-east2').https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

export const render = functions
    .region('asia-east2')
    .runWith({ memory: '2GB' })
    .https.onRequest(async (request, response) => {

        // Launch a browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process']
        });

        // Pass a URL via a query param
        const requestURL = request.query.requestURL;

        // Visit the page a get content
        const page = await browser.newPage();

        await page.goto(requestURL, { waitUntil: 'networkidle0' })

        const content = await page.content();

        // Send the response
        response.status(200).send(content);
    });
