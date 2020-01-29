const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  const url =
    'https://www.linkedin.com/posts/nishantjain131_startupjobs-jobs-hiring-activity-6623233610138951680-Yt1k'; // Change this url

  await page.goto(url);

  await page.setViewport({ width: 1920, height: 981 });

  await page.waitForSelector(
    '.share-update-card > .comments > .comments__sign-in-wrapper > .comments__guest-input-wrapper > a'
  );
  await page.click(
    '.share-update-card > .comments > .comments__sign-in-wrapper > .comments__guest-input-wrapper > a'
  );

  await page.type('#username', 'user@email.com'); // enter username
  await page.type(' #password', 'Password'); // enter password

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
  
  let texts = await page.$$eval('a.comments-post-meta__actor-link', ele =>
  ele.map(el => el.href)
  );
  const uniq = [...new Set(texts)].sort();
  console.log(uniq);
  const details = [];
  for (let i = 0; i < Math.min(uniq.length, 50); i++) {
    el = uniq[i];
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

      const title = document.querySelector('h2').innerText;

      const skills = [
        ...document.querySelectorAll('.pv-profile-section ol li div div p')
      ].map(el => el.innerText);
      console.log(skills);

      return {
        fullName,
        title,
        skills
      };
    });
    details.push(userProfile);
  }
  let userProfileJSON = JSON.stringify(details);
  fs.writeFile('client/src/profileData.json', userProfileJSON, 'utf-8', err => {
    if (err) throw err;
  });

  await browser.close();
})();
