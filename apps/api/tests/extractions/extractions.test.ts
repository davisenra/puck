import { afterEach, beforeEach, describe, expect, test } from 'bun:test';

import { createElysiaApplication } from '../../src/application';
import CoffeeService from '../../src/coffees/service';
import EquipmentService from '../../src/equipment/service';
import ExtractionService from '../../src/extractions/service';
import { setupTestDatabase, teardownTestDatabase } from '../helper';

describe('/extractions', async () => {
  const app = await createElysiaApplication();

  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterEach(() => {
    teardownTestDatabase();
  });

  test('returns list of extractions', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    await ExtractionService.save({
      coffeeId: coffee.id,
      brewerId: brewer.id,
      grinderId: null,
      grindSetting: null,
      dose: 20,
      yield: 40,
      brewTime: 30,
      waterTemp: null,
      rating: 4,
      tastingNotes: 'Good brew',
      recipeMetadata: null,
    });

    const response = await app.handle(new Request('http://localhost/extractions'));
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.data).toBeArray();
    expect(json.data).toBeArrayOfSize(1);
    expect(json.meta.total).toBe(1);
    expect(json.meta.page).toBe(1);
    expect(json.meta.perPage).toBe(25);
    expect(json.meta.totalPages).toBe(1);
    expect(json.data[0].dose).toBe(20);
    expect(json.data[0].rating).toBe(4);
    expect(json.data[0].brewer.id).toBe(brewer.id);
    expect(json.data[0].brewer.name).toBe('Test Brewer');
    expect(json.data[0].grinder).toBeNull();
  });

  test('creates new extraction and returns 201', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    const response = await app.handle(
      new Request('http://localhost/extractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coffeeId: coffee.id,
          brewerId: brewer.id,
          grinderId: null,
          grindSetting: null,
          dose: 20,
          yield: 40,
          brewTime: 30,
          waterTemp: null,
          rating: 4,
          tastingNotes: 'Good brew',
          recipeMetadata: null,
        }),
      }),
    );

    expect(response.status).toBe(201);
    const data = await response.json();

    expect(data.dose).toBe(20);
    expect(data.yield).toBe(40);
    expect(data.brewTime).toBe(30);
    expect(data.rating).toBe(4);
    expect(data.id).toBeDefined();
  });

  test('deletes extraction and returns 204', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    const created = await ExtractionService.save({
      coffeeId: coffee.id,
      brewerId: brewer.id,
      grinderId: null,
      grindSetting: null,
      dose: 20,
      yield: 40,
      brewTime: 30,
      waterTemp: null,
      rating: 4,
      tastingNotes: 'Good brew',
      recipeMetadata: null,
    });

    const response = await app.handle(
      new Request(`http://localhost/extractions/${created.id}`, {
        method: 'DELETE',
      }),
    );

    expect(response.status).toBe(204);
  });

  test('returns empty list when no extractions exist', async () => {
    const response = await app.handle(new Request('http://localhost/extractions'));
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.data).toBeArray();
    expect(json.data).toBeArrayOfSize(0);
    expect(json.meta.total).toBe(0);
    expect(json.meta.totalPages).toBe(0);
  });

  test('returns extraction by id when exists', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    const created = await ExtractionService.save({
      coffeeId: coffee.id,
      brewerId: brewer.id,
      grinderId: null,
      grindSetting: null,
      dose: 20,
      yield: 40,
      brewTime: 30,
      waterTemp: null,
      rating: 4,
      tastingNotes: 'Good brew',
      recipeMetadata: null,
    });

    const response = await app.handle(new Request(`http://localhost/extractions/${created.id}`));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.id).toBe(created.id);
    expect(data.dose).toBe(20);
    expect(data.yield).toBe(40);
    expect(data.brewer.id).toBe(brewer.id);
    expect(data.brewer.name).toBe('Test Brewer');
  });

  test('returns extraction with brewer and grinder data', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });
    const grinder = await EquipmentService.save({ name: 'Test Grinder', type: 'GRINDER' });

    const created = await ExtractionService.save({
      coffeeId: coffee.id,
      brewerId: brewer.id,
      grinderId: grinder.id,
      grindSetting: '3',
      dose: 20,
      yield: 40,
      brewTime: 30,
      waterTemp: 90,
      rating: 4,
      tastingNotes: 'Good brew',
      recipeMetadata: null,
    });

    const response = await app.handle(new Request(`http://localhost/extractions/${created.id}`));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.brewer.id).toBe(brewer.id);
    expect(data.brewer.name).toBe('Test Brewer');
    expect(data.grinder.id).toBe(grinder.id);
    expect(data.grinder.name).toBe('Test Grinder');
  });

  test('returns extraction with null grinder when not set', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    const created = await ExtractionService.save({
      coffeeId: coffee.id,
      brewerId: brewer.id,
      grinderId: null,
      grindSetting: null,
      dose: 20,
      yield: 40,
      brewTime: 30,
      waterTemp: null,
      rating: 4,
      tastingNotes: 'Good brew',
      recipeMetadata: null,
    });

    const response = await app.handle(new Request(`http://localhost/extractions/${created.id}`));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.brewer.id).toBe(brewer.id);
    expect(data.brewer.name).toBe('Test Brewer');
    expect(data.grinder).toBeNull();
  });

  test('returns 404 when extraction by id does not exist', async () => {
    const response = await app.handle(new Request('http://localhost/extractions/9999'));
    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data.error).toBe('Extraction not found');
  });

  test('updates extraction and returns 200', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    const created = await ExtractionService.save({
      coffeeId: coffee.id,
      brewerId: brewer.id,
      grinderId: null,
      grindSetting: null,
      dose: 20,
      yield: 40,
      brewTime: 30,
      waterTemp: null,
      rating: 4,
      tastingNotes: 'Good brew',
      recipeMetadata: null,
    });

    const response = await app.handle(
      new Request(`http://localhost/extractions/${created.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dose: 22,
          yield: 44,
          brewTime: 35,
          rating: 5,
          tastingNotes: 'Better brew',
        }),
      }),
    );

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.id).toBe(created.id);
    expect(data.dose).toBe(22);
    expect(data.yield).toBe(44);
    expect(data.brewTime).toBe(35);
    expect(data.rating).toBe(5);
    expect(data.tastingNotes).toBe('Better brew');
  });

  test('returns 400 when coffee_id does not exist', async () => {
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    const response = await app.handle(
      new Request('http://localhost/extractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coffeeId: 9999,
          brewerId: brewer.id,
          grinderId: null,
          grindSetting: null,
          dose: 20,
          yield: 40,
          brewTime: 30,
          waterTemp: null,
          rating: 4,
          tastingNotes: 'Good brew',
          recipeMetadata: null,
        }),
      }),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Coffee not found');
  });

  test('returns 400 when brewer_id does not exist', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });

    const response = await app.handle(
      new Request('http://localhost/extractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coffeeId: coffee.id,
          brewerId: 9999,
          grinderId: null,
          grindSetting: null,
          dose: 20,
          yield: 40,
          brewTime: 30,
          waterTemp: null,
          rating: 4,
          tastingNotes: 'Good brew',
          recipeMetadata: null,
        }),
      }),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Brewer not found');
  });

  test('returns 400 when brewer has wrong type', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const grinder = await EquipmentService.save({ name: 'Test Grinder', type: 'GRINDER' });

    const response = await app.handle(
      new Request('http://localhost/extractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coffeeId: coffee.id,
          brewerId: grinder.id,
          grinderId: null,
          grindSetting: null,
          dose: 20,
          yield: 40,
          brewTime: 30,
          waterTemp: null,
          rating: 4,
          tastingNotes: 'Good brew',
          recipeMetadata: null,
        }),
      }),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Equipment must be of type BREWER');
  });

  test('returns 400 when grinder_id does not exist', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    const response = await app.handle(
      new Request('http://localhost/extractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coffeeId: coffee.id,
          brewerId: brewer.id,
          grinderId: 9999,
          grindSetting: null,
          dose: 20,
          yield: 40,
          brewTime: 30,
          waterTemp: null,
          rating: 4,
          tastingNotes: 'Good brew',
          recipeMetadata: null,
        }),
      }),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Grinder not found');
  });

  test('returns 400 when grinder has wrong type', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });
    const brewer2 = await EquipmentService.save({ name: 'Test Brewer 2', type: 'BREWER' });

    const response = await app.handle(
      new Request('http://localhost/extractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coffeeId: coffee.id,
          brewerId: brewer.id,
          grinderId: brewer2.id,
          grindSetting: null,
          dose: 20,
          yield: 40,
          brewTime: 30,
          waterTemp: null,
          rating: 4,
          tastingNotes: 'Good brew',
          recipeMetadata: null,
        }),
      }),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Equipment must be of type GRINDER');
  });

  test('creates extraction with archived coffee', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
      archived: true,
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    const response = await app.handle(
      new Request('http://localhost/extractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coffeeId: coffee.id,
          brewerId: brewer.id,
          grinderId: null,
          grindSetting: null,
          dose: 20,
          yield: 40,
          brewTime: 30,
          waterTemp: null,
          rating: 4,
          tastingNotes: 'Good brew',
          recipeMetadata: null,
        }),
      }),
    );

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.coffee.id).toBe(coffee.id);
  });

  test('PUT returns 400 when coffee no longer exists', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    const created = await ExtractionService.save({
      coffeeId: coffee.id,
      brewerId: brewer.id,
      grinderId: null,
      grindSetting: null,
      dose: 20,
      yield: 40,
      brewTime: 30,
      waterTemp: null,
      rating: 4,
      tastingNotes: 'Good brew',
      recipeMetadata: null,
    });

    await CoffeeService.destroy(coffee.id);

    const response = await app.handle(
      new Request(`http://localhost/extractions/${created.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dose: 22,
        }),
      }),
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Coffee not found');
  });

  test('returns first page with default pagination (25 items)', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    for (let i = 0; i < 30; i++) {
      await ExtractionService.save({
        coffeeId: coffee.id,
        brewerId: brewer.id,
        grinderId: null,
        grindSetting: null,
        dose: 20,
        yield: 40,
        brewTime: 30,
        waterTemp: null,
        rating: 4,
        tastingNotes: 'Good brew',
        recipeMetadata: null,
      });
    }

    const response = await app.handle(new Request('http://localhost/extractions'));
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.data).toBeArrayOfSize(25);
    expect(json.meta.total).toBe(30);
    expect(json.meta.page).toBe(1);
    expect(json.meta.perPage).toBe(25);
    expect(json.meta.totalPages).toBe(2);
  });

  test('returns correct page when page param provided', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    for (let i = 0; i < 30; i++) {
      await ExtractionService.save({
        coffeeId: coffee.id,
        brewerId: brewer.id,
        grinderId: null,
        grindSetting: null,
        dose: 20,
        yield: 40,
        brewTime: 30,
        waterTemp: null,
        rating: 4,
        tastingNotes: 'Good brew',
        recipeMetadata: null,
      });
    }

    const response = await app.handle(new Request('http://localhost/extractions?page=2'));
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.data).toBeArrayOfSize(5);
    expect(json.meta.total).toBe(30);
    expect(json.meta.page).toBe(2);
    expect(json.meta.perPage).toBe(25);
    expect(json.meta.totalPages).toBe(2);
  });

  test('returns correct items when perPage param provided', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    for (let i = 0; i < 10; i++) {
      await ExtractionService.save({
        coffeeId: coffee.id,
        brewerId: brewer.id,
        grinderId: null,
        grindSetting: null,
        dose: 20,
        yield: 40,
        brewTime: 30,
        waterTemp: null,
        rating: 4,
        tastingNotes: 'Good brew',
        recipeMetadata: null,
      });
    }

    const response = await app.handle(new Request('http://localhost/extractions?perPage=5'));
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.data).toBeArrayOfSize(5);
    expect(json.meta.total).toBe(10);
    expect(json.meta.page).toBe(1);
    expect(json.meta.perPage).toBe(5);
    expect(json.meta.totalPages).toBe(2);
  });

  test('returns empty array for page beyond available data', async () => {
    const coffee = await CoffeeService.save({
      roaster: 'Test Roaster',
      name: 'Test Coffee',
      roastDate: new Date('2024-01-01'),
      process: 'Washed',
      notes: 'Test notes',
    });
    const brewer = await EquipmentService.save({ name: 'Test Brewer', type: 'BREWER' });

    await ExtractionService.save({
      coffeeId: coffee.id,
      brewerId: brewer.id,
      grinderId: null,
      grindSetting: null,
      dose: 20,
      yield: 40,
      brewTime: 30,
      waterTemp: null,
      rating: 4,
      tastingNotes: 'Good brew',
      recipeMetadata: null,
    });

    const response = await app.handle(new Request('http://localhost/extractions?page=999'));
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.data).toBeArrayOfSize(0);
    expect(json.meta.total).toBe(1);
    expect(json.meta.page).toBe(999);
    expect(json.meta.perPage).toBe(25);
    expect(json.meta.totalPages).toBe(1);
  });
});
