const { Sequelize, DataTypes } = require('sequelize');
const db = new Sequelize(
  process.env.DATABASE_URL ||
    'postgres://localhost/dealers_choice_sequelize_db',
  { logging: false }
);

// MODELS
const Competition = db.define('Competition', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Dog = db.define('Dog', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

//CLASS METHODS
Competition.findCompetitions = function () {
  return this.findAll({
    order: [['name', 'ASC']],
    include: [
      {
        model: Dog,
        as: 'winner',
      },
    ],
  });
};

Dog.findDogs = function () {
  return this.findAll({
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
};

Competition.belongsTo(Dog, { as: 'winner' });
Dog.hasMany(Competition, { foreignKey: 'winnerId' });

Dog.belongsTo(Dog, { as: 'victor' });
Dog.hasMany(Dog, { foreignKey: 'victorId' });

const syncAndSeed = async () => {
  await db.sync({ force: true });
  const dogs = [
    { name: 'Bailey', breed: 'Labrador Retriever' },
    { name: 'Charlie', breed: 'Labrador Retriever' },
    { name: 'Lily', breed: 'Cocker Spaniel' },
    { name: 'Penny', breed: 'Cocker Spaniel' },
    { name: 'Gigi', breed: 'Chihuahua' },
    { name: 'Peanut', breed: 'Chihuahua' },
    { name: 'Cody', breed: 'Pug' },
    { name: 'Rufus', breed: 'Pug' },
  ];

  // this eliminates a lot of repetition
  const [
    bailey,
    charlie,
    lily,
    penny,
    gigi,
    peanut,
    cody,
    rufus,
  ] = await Promise.all(
    dogs.map((dog) => Dog.create({ name: dog.name, breed: dog.breed }))
  );

  const competitions = [
    { name: 'Breed Class - Labrador Retriever', winnerId: bailey.id },
    { name: 'Breed Class - Cocker Spaniel', winnerId: penny.id },
    { name: 'Breed Class - Chihuahua', winnerId: gigi.id },
    { name: 'Breed Class - Pug', winnerId: cody.id },
    { name: 'Sporting Group', winnerId: bailey.id },
    { name: 'Non-sporting Group', winnerId: gigi.id },
    { name: 'Best In Show', winnerId: gigi.id },
  ];

  await Promise.all(
    competitions.map((competition) =>
      Competition.create({
        name: competition.name,
        winnerId: competition.winnerId,
      })
    )
  );

  // if we instead use the update() method, we do NOT need to save() anymore- this UPDATES & SAVES it
  await Promise.all([
    bailey.update({ victorId: gigi.id }),
    charlie.update({ victorId: bailey.id }),
    lily.update({ victorId: penny.id }),
    penny.update({ victorId: bailey.id }),
    peanut.update({ victorId: gigi.id }),
    cody.update({ victorId: gigi.id }),
    rufus.update({ victorId: cody.id }),
  ]);
};

module.exports = {
  db,
  models: {
    Competition,
    Dog,
  },
  syncAndSeed,
};
