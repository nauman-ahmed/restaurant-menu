const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const { getAllSubscription } = require("../resolvers/subscription")
const nodemailer = require('nodemailer');

const EMAIL_PASS = "vils yuht uyla xrov"
const EMAIL_USER = "naumanahmed449@gmail.com"

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: EMAIL_USER, 
    pass: EMAIL_PASS 
  }
});

const sendMenuEmail = async (email, menu) => {
  const menuHtml = formatMenuAsHtml(menu);
    console.log("ENV", EMAIL_USER, EMAIL_PASS)
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Weekly Menu - Subscribe',
    html: menuHtml
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Menu sent to ${email}`);
  } catch (error) {
    console.error(`Error sending email to ${email}: `, error);
  }
};

const formatMenuAsHtml = (menu) => {
  let htmlContent = '<h1>Weekly Menu</h1><ul>';

  menu.forEach((day) => {
    htmlContent += `<li><h2>${day.day} (${day.date})</h2><ul>`;
    day.data.forEach((meal) => {
      htmlContent += `<li><strong>${meal.meal}</strong><ul>`;
      meal.foods.forEach((food) => {
        htmlContent += `<li>${food}</li>`;
      });
      htmlContent += '</ul></li>';
    });
    htmlContent += '</ul></li>';
  });

  htmlContent += '</ul>';
  return htmlContent;
};

const customMenu = async () => {
    try {
        // Step 1: Scrape the menu data
        const menu = await scrapeMenuData();
    
        // Step 2: Get the subscribed users
        const subscribedUsers = await getAllSubscription();
        
        if(subscribedUsers.length){
            // Step 3: Send menu to each subscribed user
            subscribedUsers.forEach(async (user) => {
                await sendMenuEmail(user.email, menu);
            });
        }
    
        console.log('Weekly menu email sent to all subscribed users.');
    } catch (error) {
      console.error('Error occurred while sending menu emails: ', error);
    }
}

cron.schedule('0 8 * * 4', async () => {
    await customMenu()
});
  
const scrapeMenuData = async () => {
    const url = 'https://www.oxy.edu/student-life/campus-dining/where-eat/marketplace'; // Replace with the actual URL
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let menu = [];
    let currentDay = null;

    $('p').each((i, element) => {
      const dayTag = $(element).find('u strong'); // Target day
      const mealTag = $(element).find('strong').first(); // Target meal

      // Check if it's a day heading
      if (dayTag.length) {
        if (currentDay) {
          menu.push(currentDay); // Save the previous day's data
        }

        // Extract the day name and date
        const dayText = dayTag.text().trim().split(','); // Splitting by ',' to get the day and date
        currentDay = {
          day: dayText[0].trim(), // E.g., "Sunday"
          date: dayText[1]?.trim(), // E.g., "September 22, 2024"
          data: []
        };
      }

      // Check if it's a meal heading
      if (!dayTag.length && mealTag.length && mealTag.text().match(/\d/)) {
        const mealName = mealTag.text().trim(); // Extract meal name
        const foodItems = $(element).html().split('<br>').map(item => item.trim()).filter(item => item && !item.includes(mealName));

        // Create a meal object
        const currentMeal = {
          meal: mealName,
          foods: foodItems
        };

        currentDay?.data.push(currentMeal); // Add meal to current day
      }
    });

    if (currentDay) {
      menu.push(currentDay);
    }
    currentDay === null
    return menu;
};

module.exports = {scrapeMenuData, customMenu};