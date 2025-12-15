// src/seed/seedData.js
// Creates basic Org Units and Divisions if DB is empty.

const OrgUnit = require('../models/OrgUnit');
const Division = require('../models/Division');

async function seedInitialData() {
  const count = await OrgUnit.countDocuments();
  if (count > 0) {
    return; // already seeded
  }

  console.log('Seeding initial Org Units and Divisions...');

  const ouNames = [
    'News management',
    'Software reviews',
    'Hardware reviews',
    'Opinion publishing',
  ];

  const orgUnits = await OrgUnit.insertMany(
    ouNames.map((name) => ({ name }))
  );

  // Simple divisions for each OU
  const divisionsData = [];

  orgUnits.forEach((ou) => {
    divisionsData.push(
      { name: `${ou.name} – IT`, orgUnit: ou._id },
      { name: `${ou.name} – Finance`, orgUnit: ou._id },
      { name: `${ou.name} – Editorial`, orgUnit: ou._id }
    );
  });

  await Division.insertMany(divisionsData);
  console.log('Initial Org Units and Divisions created.');
}

module.exports = seedInitialData;
