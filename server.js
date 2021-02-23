const {
  db,
  models: { Competition, Dog },
  syncAndSeed,
} = require('./db');
const path = require('path');

const express = require('express');
const app = express();

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/api/competitionLevels', async (req, res, next) => {
  try {
    const competitionLevels = await Competition.findAll({
      order: [['name', 'ASC']],
      include: [
        {
          model: Dog,
          as: 'winner',
        },
      ],
    });
    res.send(competitionLevels);
  } catch (err) {
    console.error(error);
  }
});

app.get('/api/dogs', async (req, res, next) => {
  try {
    const dogs = await Dog.findAll({
      order: [['id', 'ASC']],
      include: [
        {
          model: Dog,
          as: 'victor',
        },
        {
          model: Dog,
        },
        {
          model: Competition,
        },
      ],
    });
    res.send(dogs);
  } catch (err) {
    console.error(err);
  }
});

const init = async () => {
  try {
    await db.authenticate();
    syncAndSeed();
    console.log('-----connected to db!-----');
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`App listening on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};

init();
