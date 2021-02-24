const {
  db,
  models: { Competition, Dog },
  syncAndSeed,
} = require('./db');

const express = require('express');
const app = express();

app.get('/', async (req, res, next) => {
  try {
    const [competitionLevels, dogs] = await Promise.all([
      await Competition.findCompetitions(),
      await Dog.findDogs(),
    ]);
    const html = `
      <html>
        <head>
        <script defer src="/dist/main.js" defer></script>
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
                        Wins: ${
                          dog.Competitions.length !== 0
                            ? `${dog.Competitions.map(
                                (competition) => competition.name
                              )}`
                            : 0
                        }
                      </li>
                      <li>
                        Defeated: ${
                          dog.Dogs.length !== 0
                            ? `${dog.Dogs.map((dog) => dog.name)}`
                            : 0
                        }
                      </li>
                      <li>
                        ${
                          dog.victor !== null
                            ? `Lost to ${dog.victor.name}`
                            : 'Won the tournament!'
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
