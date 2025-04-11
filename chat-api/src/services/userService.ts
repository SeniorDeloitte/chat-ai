import DatabaseSingleton from "../database";

class UserService {
  private db;

  constructor() {
    this.db = DatabaseSingleton.getInstance();
  }

  initializeUsersTable() {
    const initialUsers = [
      { id: 1, name: "John Doe", email: "john.doe@example.com", role: "user" },
      { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "user" },
      { id: 3, name: "Michael Brown", email: "michael.brown@example.com", role: "user" },
      { id: 4, name: "Emily Davis", email: "emily.davis@example.com", role: "user" },
      { id: 5, name: "Chris Wilson", email: "chris.wilson@example.com", role: "user" },
      { id: 6, name: "Sarah Johnson", email: "sarah.johnson@example.com", role: "user" },
      { id: 7, name: "David Martinez", email: "david.martinez@example.com", role: "user" },
      { id: 8, name: "Laura Garcia", email: "laura.garcia@example.com", role: "user" },
      { id: 9, name: "James Anderson", email: "james.anderson@example.com", role: "user" },
      { id: 10, name: "Sophia Lee", email: "sophia.lee@example.com", role: "user" },
    ];

    try {
      this.db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL
      )`);

      const insertStmt = this.db.prepare(
        "INSERT OR IGNORE INTO users (id, name, email, role) VALUES (?, ?, ?, ?)"
      );
      this.db.transaction(() => {
        for (const user of initialUsers) {
          insertStmt.run(user.id, user.name, user.email, user.role);
        }
      })();
    } catch (error) {
      console.error("Error initializing users table:", error);
    }
  }

  getAllUsers() {
    try {
      return this.db.query("SELECT * FROM users").all();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("An internal error occurred while fetching users.");
    }
  }
}

export default new UserService();