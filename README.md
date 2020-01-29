Scrap user profile data from linkedin and show on web page.
Uses puppeteer with NodeJS and ReactJS.

### Clone this repo:

```git clone https://github.com/AnuragGupta93/LinkedIn-Post-Parser.git```

### Prerequisites:


1. Node.js
2. NPM

* **Install Node.js/NPM from**: https://nodejs.org/en/

### Install the dependencies:
1. Install required dependencies for NodeJS
   
  ```npm install```
2. Install required dependencies for ReactJS
   
   ```cd client```
   ```npm install```

### Woking:

1. Change url in the index.js file to required url.
   
```
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  const url =
    'https://www.linkedin.com/posts/nishantjain131_startupjobs-jobs-hiring-activity-6623233610138951680-Yt1k'; 
    // Change this url

  await page.goto(url);
  ```
2. Enter your linkedIn Id and password:

```
  await page.type('#username', 'user@email.com'); // enter username
  await page.type(' #password', 'Password'); // enter password
```
3. Enter command in same directory to run application:

```node index.js```

(  This will take some time (atmost 15 minutes) on scrapping posts which have more than 500 comments )

4. For running on web:

```
cd client
npm start
```
( It will start the web page )

5. Search for required skills in the search box.


![Video](https://gifs.com/gif/video-4QwXJ1)
