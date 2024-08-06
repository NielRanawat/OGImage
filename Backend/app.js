const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/generate-og-image', async (req, res) => {
  const { title, content} = req.body;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          width: 1200px;
          height: 630px;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: Arial, sans-serif;
          position: relative;
        }
        .container {
          width: 100%;
          height: 100%;
          background: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 20px;
          box-sizing: border-box;
        }
        .title {
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .content-snippet {
          font-size: 24px;
          margin-bottom: 20px;
        }
        .image {
          max-width: 100%;
          max-height: 400px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="title">${title}</div>
        <div class="content-snippet">${content}</div>
      </div>
    </body>
    </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  await page.setViewport({ width: 1200, height: 630 });

  const imageBuffer = await page.screenshot();
  await browser.close();

  res.setHeader('Content-Type', 'image/png');
  res.send(imageBuffer);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
