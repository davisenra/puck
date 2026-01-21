import CoffeeService from '../src/coffees/service';
import { db } from '../src/database';
import EquipmentService from '../src/equipment/service';
import ExtractionService from '../src/extractions/service';
import logger from '../src/logger';

const equipmentNames = {
  GRINDER: ['Baratza Virtuoso+', 'Comandante C40'],
  BREWER: ['Flair 58', 'Decent DE1', 'V60'],
};

const roasters = [
  'Onyx Coffee Lab',
  'Heart Coffee Roasters',
  'Sightglass',
  'Intelligentsia',
  'Square Mile',
];
const coffeeNames = [
  'Ethiopia Yirgacheffe',
  'Colombia Huila',
  'Guatemala Antigua',
  'Brazil Cerrado',
  'Costa Rica Tarrazu',
];
const processes = ['Washed', 'Natural', 'Honey', 'Anaerobic'];
const tastingNotes = [
  'Bright acidity with citrus notes',
  'Chocolatey body with nutty finish',
  'Floral aroma with berry sweetness',
  'Clean and balanced with stone fruit',
  'Bold and rich with caramel notes',
  'Complex with hints of jasmine',
  'Smooth with vanilla undertones',
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
}

function getRandomDate(daysAgo = 60): Date {
  const now = new Date();
  const pastDate = new Date(now.getTime() - getRandomInt(0, daysAgo * 24 * 60 * 60 * 1000));
  return pastDate;
}

async function clearTables() {
  logger.info('Clearing existing data...');
  db.run('DELETE FROM extractions');
  db.run('DELETE FROM coffees');
  db.run('DELETE FROM equipment');
  logger.info('Tables cleared');
}

async function seedEquipment() {
  logger.info('Seeding equipment...');

  const grinders = equipmentNames.GRINDER.map((name) => ({ name, type: 'GRINDER' as const }));
  const brewers = equipmentNames.BREWER.map((name) => ({ name, type: 'BREWER' as const }));

  for (const eq of [...grinders, ...brewers]) {
    await EquipmentService.save(eq);
  }

  logger.info('Seeded 5 equipment items (2 grinders, 3 brewers)');
}

async function seedCoffees() {
  logger.info('Seeding coffees...');

  for (let i = 0; i < 10; i++) {
    const roaster = getRandomItem(roasters);
    const coffeeName = getRandomItem(coffeeNames);
    const process = getRandomItem(processes);
    const roastDate = getRandomDate();
    const notes = getRandomItem(tastingNotes);

    await CoffeeService.save({
      roaster,
      name: coffeeName,
      roastDate,
      process,
      notes,
      archived: false,
    });
  }

  logger.info('Seeded 10 coffees');
}

async function seedExtractions() {
  logger.info('Seeding extractions...');

  const coffees = await CoffeeService.listAll();
  const brewers = await EquipmentService.listAll('BREWER');
  const grinders = await EquipmentService.listAll('GRINDER');

  if (coffees.length === 0 || brewers.length === 0) {
    logger.error('No coffees or brewers found in database');
    process.exit(1);
  }

  for (let i = 0; i < 50; i++) {
    const coffee = getRandomItem(coffees);
    const brewer = getRandomItem(brewers);
    const useGrinder = Math.random() > 0.2;
    const grinder = useGrinder ? getRandomItem(grinders) : null;

    const grindSettings = ['5', '6', '7', '8', '9', '10', '1.5', '2.0', '2.5', '3.0'];
    const grindSetting = useGrinder ? getRandomItem(grindSettings) : null;

    const dose = getRandomFloat(15, 22, 1);
    const yieldWeight = getRandomFloat(30, 50, 1);
    const brewTime = getRandomFloat(20, 40, 1);
    const waterTemp = getRandomFloat(85, 96, 0);
    const rating = getRandomInt(1, 5);
    const tastingNote = Math.random() > 0.5 ? getRandomItem(tastingNotes) : null;

    const recipeMetadata = Math.random() > 0.7 ? { preInfusion: getRandomInt(3, 10) } : null;

    await ExtractionService.save({
      coffeeId: coffee.id,
      brewerId: brewer.id,
      grinderId: grinder?.id ?? null,
      grindSetting,
      dose,
      yield: yieldWeight,
      brewTime,
      waterTemp,
      rating,
      tastingNotes: tastingNote,
      recipeMetadata,
    });
  }

  logger.info('Seeded 50 extractions');
}

async function seed() {
  try {
    logger.info('Starting database seed...');
    await clearTables();
    await seedEquipment();
    await seedCoffees();
    await seedExtractions();
    logger.info('Database seeded successfully!');
  } catch (error) {
    logger.error({ error }, 'Failed to seed database');
    process.exit(1);
  }
}

await seed();
