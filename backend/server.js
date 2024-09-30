const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors')

const app = express();
const PORT = 5003;
app.use(cors())

app.get('/scrape', async (req, res) => {
  try {
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

    // Push the last day's data
    if (currentDay) {
      menu.push(currentDay);
    }
    currentDay === null

    // console.log(menu);
    res.json(menu); // Send the scraped menu data as JSON

  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while scraping the website');
  }

});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
