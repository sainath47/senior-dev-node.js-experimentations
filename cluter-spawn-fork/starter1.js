const express = require('express');

const app = express();

function delay(duration) {
  const startTime = Date.now();
  while(Date.now() - startTime < duration) {
    //event loop is blocked...
  }
}

app.get('/', (req, res) => {
  res.send('Performance example');
});

app.get('/timer', (req, res) => {
  delay(9000);
  res.send('Ding ding ding!');
})

app.listen(3000);


// so in this template iam trying to show , how the blocking process is really slowing down our whole application , 
//even executing the '/' after the '/timer' making the '/' slower by 5+ secounds every time
//so what can we do to make the application faster 
// as the 200ms is the standardard response should be, load times larger than 3 sec, makes the users loose interest