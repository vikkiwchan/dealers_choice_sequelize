const {
  db,
  models: { Competition, Dog },
  syncAndSeed,
} = require('./db');
//const path = require('path');

const express = require('express');
const app = express();

//app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/api/competitionLevels', async (req, res, next) => {
  try {
    res.send(await Competition.findCompetitions());
  } catch (err) {
    console.error(error);
  }
});

app.get('/api/dogs', async (req, res, next) => {
  try {
    res.send(await Dog.findDogs());
  } catch (err) {
    console.error(err);
  }
});

app.get('/', async (req, res, next) => {
  try {
    const [competitionLevels, dogs] = await Promise.all([
      await Competition.findCompetitions(),
      await Dog.findDogs(),
    ]);
    const html = `
      <html>
        <head>
         <title>American Kennel Club</title>
        </head>
        <body style="font-family:Verdana;">
          <h1 style="text-align:center;">American Kennel Club</h1>
          <div id="container" style="display:flex;justify-content:space-around;">
            <div class="div-child">
              <h3>Competition Levels</h3>
              <ul id="competition-list" style="list-style:none;">
                ${competitionLevels
                  .map(
                    (competition) => `
                  <li>
                    ${competition.name}
                    <ul>
                      <li>
                        Winner: ${competition.winner.name}
                      </li>
                    </ul>
                  </li>
                `
                  )
                  .join('')}
              </ul>
            </div>
            <div class="div-child">
              <h3>Fabulous 4-Legged Participants</h3>
              <ul id="dogs-list" style="list-style:none;">
                ${dogs
                  .map(
                    (dog) => `
                  <li>
                    ${dog.name}
                    <ul>
                      <li>
                        Breed: ${dog.breed}
                      </li>
                      <li>
                        Wins: ${dog.Competitions.map(
                          (competition) => competition.name
                        )}
                      </li>
                      <li>
                        Defeated: ${dog.Dogs.map((dog) => dog.name)}
                      </li>
                      <li>
                        Lost to: ${
                          dog.victor.name !== null ? dog.victor.name : 'null'
                        }
                      </li>
                    </ul>
                  </li>
                `
                  )
                  .join('')}
              </ul>
            </div>
          </div>
        </body>
      </html>
    `;
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

const init = async () => {
  try {
    await db.authenticate();
    syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`App listening on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};

init();
