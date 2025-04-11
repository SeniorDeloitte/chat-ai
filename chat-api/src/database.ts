import { Database } from "bun:sqlite";

class DatabaseSingleton {
  private static instance: Database;

  private constructor() {}

  public static getInstance(): Database {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new Database("./database.sqlite");
    }
    return DatabaseSingleton.instance;
  }
}

export default DatabaseSingleton;
