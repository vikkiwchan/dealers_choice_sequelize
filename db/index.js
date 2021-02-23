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
  const [
    bailey,
    charlie,
    lily,
    penny,
    gigi,
    peanut,
    cody,
    rufus,
    breedClass_LabRet,
    breedClass_CockerSpan,
    breedClass_Chihuahua,
    breedClass_Pug,
    sportingGroup,
    nonSportingGroup,
    bestInShow,
  ] = await Promise.all([
    Dog.create({ name: 'Bailey', breed: 'Labrador Retriever' }),
    Dog.create({ name: 'Charlie', breed: 'Labrador Retriever' }),
    Dog.create({ name: 'Lily', breed: 'Cocker Spaniel' }),
    Dog.create({ name: 'Penny', breed: 'Cocker Spaniel' }),
    Dog.create({ name: 'Gigi', breed: 'Chihuahua' }),
    Dog.create({ name: 'Peanut', breed: 'Chihuahua' }),
    Dog.create({ name: 'Cody', breed: 'Pug' }),
    Dog.create({ name: 'Rufus', breed: 'Pug' }),
    Competition.create({ name: 'Breed Class - Labrador Retriever' }),
    Competition.create({ name: 'Breed Class - Cocker Spaniel' }),
    Competition.create({ name: 'Breed Class - Chihuahua' }),
    Competition.create({ name: 'Breed Class - Pug' }),
    Competition.create({ name: 'Sporting Group' }),
    Competition.create({ name: 'Non-sporting Group' }),
    Competition.create({ name: 'Best In Show' }),
  ]);
  breedClass_LabRet.winnerId = bailey.id;
  breedClass_CockerSpan.winnerId = penny.id;
  breedClass_Chihuahua.winnerId = gigi.id;
  breedClass_Pug.winnerId = cody.id;
  sportingGroup.winnerId = bailey.id;
  nonSportingGroup.winnerId = gigi.id;
  bestInShow.winnerId = gigi.id;
  bailey.victorId = gigi.id;
  charlie.victorId = bailey.id;
  lily.victorId = penny.id;
  penny.victorId = bailey.id;
  peanut.victorId = gigi.id;
  cody.victorId = gigi.id;
  rufus.victorId = cody.id;
  await Promise.all([
    breedClass_LabRet.save(),
    breedClass_CockerSpan.save(),
    breedClass_Chihuahua.save(),
    breedClass_Pug.save(),
    sportingGroup.save(),
    nonSportingGroup.save(),
    bestInShow.save(),
    bailey.save(),
    charlie.save(),
    lily.save(),
    penny.save(),
    peanut.save(),
    cody.save(),
    rufus.save(),
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
