import { Hono } from "hono";
import userService from "./userService";

// Initialize SQLite database and users table
userService.initializeUsersTable();

const usersApp = new Hono();

usersApp.get("/users", async (c) => {
  try {
    const users = userService.getAllUsers();
    return c.json({
      message: "Success!",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.json(
      {
        message: "Error fetching users",
        error: "An internal error occurred. Please try again later.",
      },
      500
    );
  }
});

export default usersApp;
