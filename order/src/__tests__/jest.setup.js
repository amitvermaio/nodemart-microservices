import mongoose from 'mongoose';

beforeAll(() => {
  // Mock mongoose.connect so any call from app code does not hit a real DB.
  if (jest.isMockFunction(mongoose.connect)) return;

  jest.spyOn(mongoose, 'connect').mockImplementation(async () => {
    // Return a minimal fake connection object if callers expect it.
    return {
      connection: { host: 'jest-mock-host' },
    };
  });
});

afterAll(async () => {
  // Best-effort cleanup; if other tests use mongoose, they can still close it.
  try {
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch (err) {
    // Ignore disconnect errors in tests.
  }

  jest.restoreAllMocks();
});
