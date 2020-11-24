const dotenv = require('dotenv');
dotenv.config();

const puppeteer = require('puppeteer');
const fs = require('fs');
const db = require('./Models');
const config = require('./config');

const User = db.user;

const { transporter, mailOptions } = require('./config/nodemailer');

// force: true will drop the table if it already exists
db.sequelize.sync({
  force: true,
});

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  console.log(config);
  const url = config.POST_URL;

  await page.goto(url, { waitUntil: 'networkidle2' });

  await page.setViewport({ width: 1920, height: 981 });

  await page.waitForSelector(
    '.share-update-card > .share-update-card__signin-banner > a'
  );
  await page.click(
    '.share-update-card > .share-update-card__signin-banner > a'
  );

  await page.waitFor(2000);

  const LINKEDIN_USERNAME = process.env.LINKEDIN_USERNAME;
  const LINKEDIN_PASSWORD = process.env.LINKEDIN_PASSWORD;

  await page.type('#username', LINKEDIN_USERNAME); // enter username
  await page.type(' #password', LINKEDIN_PASSWORD); // enter password

  await page.waitForSelector(
    '.app__content > div > .login__form > .login__form_action_container > .btn__primary--large'
  );
  await page.click(
    '.app__content > div > .login__form > .login__form_action_container > .btn__primary--large'
  );

  await page.waitForNavigation({ timeout: 100000 });

  let t = 20;
  while (t--) {
    await page.waitForSelector(
      'li.social-details-social-counts__comments  > button > span'
    );
    await page.click(
      'li.social-details-social-counts__comments  > button > span'
    );
  }
  await page.waitFor(4000);

  let texts = await page.$$eval('a.comments-post-meta__actor-link', (ele) =>
    ele.map((el) => el.href)
  );
  const UNIQUE_SET_PROFILES = [...new Set(texts)].sort();
  console.log(UNIQUE_SET_PROFILES);

  const details = [];
  for (
    let i = 0;
    i < Math.min(UNIQUE_SET_PROFILES.length, config.PROFILE_COUNT_LIMIT);
    i++
  ) {
    el = UNIQUE_SET_PROFILES[i];
    await page.goto(el);
    await page.waitFor(1000);
    const userProfile = await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0;
        let distance = 100;
        let timer = setInterval(() => {
          let scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
      if (document.querySelector(' button.pv-profile-section__card-action-bar'))
        document
          .querySelector(' button.pv-profile-section__card-action-bar')
          .click();

      const url = window.location.href;

      const fullName = document.querySelector('li.break-words').innerText;

      const title = document.querySelector('h2.mt1').innerText;

      const skills = [
        ...document.querySelectorAll('.pv-profile-section ol li div div p'),
      ].map((el) => el.innerText);
      console.log(skills);

      const user = {
        fullName,
        title,
        skills,
      };

      return user;
    });
    details.push(userProfile);
  }
  User.bulkCreate(details)
    .then(() => {
      console.log('Successfully saved to database');
    })
    .catch(() => {
      console.log('Error occured while saving to database');
    });

  let userProfileJSON = JSON.stringify(details);
  fs.writeFile(
    'client/src/profileData.json',
    userProfileJSON,
    'utf-8',
    (err) => {
      if (err) throw err;
      else {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    }
  );

  await browser.close();
})();
