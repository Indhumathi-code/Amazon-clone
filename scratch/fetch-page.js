const axios = require('axios');

async function run() {
  try {
    const res = await axios.get('http://localhost:3000/');
    const html = res.data;
    console.log('Page fetched successfully. Length:', html.length);
    
    const footerIdx = html.indexOf('<footer');
    if (footerIdx !== -1) {
      console.log('Footer tag found at index:', footerIdx);
      console.log(html.substring(footerIdx, footerIdx + 1000));
    } else {
      console.log('No <footer tag found in the HTML!');
    }
  } catch (err) {
    console.error('Error fetching page:', err);
  }
}

run();
