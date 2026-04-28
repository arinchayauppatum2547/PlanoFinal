import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a668dfd7/health", (c) => {
  return c.json({ status: "ok" });
});

// Authentication endpoints

// Sign up endpoint
app.post("/make-server-a668dfd7/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Server error during signup: ${error.message}`);
    return c.json({ error: "Internal server error during signup" }, 500);
  }
});

// Sign in endpoint (handled by Supabase client-side, but included for completeness)
app.post("/make-server-a668dfd7/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_ANON_KEY'),
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Error during sign in: ${error.message}`);
      return c.json({ error: error.message }, 401);
    }

    return c.json({ session: data.session, user: data.user });
  } catch (error) {
    console.log(`Server error during signin: ${error.message}`);
    return c.json({ error: "Internal server error during signin" }, 500);
  }
});

// Task endpoints

// Get all tasks for a user
app.get("/make-server-a668dfd7/tasks", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      console.log(`Unauthorized access during get tasks: ${userError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const tasks = await kv.getByPrefix(`task:${user.id}:`);
    return c.json({ tasks });
  } catch (error) {
    console.log(`Server error getting tasks: ${error.message}`);
    return c.json({ error: "Internal server error while fetching tasks" }, 500);
  }
});

// Create a new task
app.post("/make-server-a668dfd7/tasks", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      console.log(`Unauthorized access during create task: ${userError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { title, description, dueDate, category, priority } = await c.req.json();

    if (!title || !dueDate) {
      return c.json({ error: "Title and due date are required" }, 400);
    }

    const taskId = crypto.randomUUID();
    const task = {
      id: taskId,
      userId: user.id,
      title,
      description: description || "",
      dueDate,
      category: category || "General",
      priority: priority || "medium",
      progress: 0,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`task:${user.id}:${taskId}`, task);

    return c.json({ task });
  } catch (error) {
    console.log(`Server error creating task: ${error.message}`);
    return c.json({ error: "Internal server error while creating task" }, 500);
  }
});

// Update a task
app.put("/make-server-a668dfd7/tasks/:taskId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      console.log(`Unauthorized access during update task: ${userError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const taskId = c.req.param('taskId');
    const existingTask = await kv.get(`task:${user.id}:${taskId}`);

    if (!existingTask) {
      return c.json({ error: "Task not found" }, 404);
    }

    const updates = await c.req.json();
    const updatedTask = {
      ...existingTask,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`task:${user.id}:${taskId}`, updatedTask);

    return c.json({ task: updatedTask });
  } catch (error) {
    console.log(`Server error updating task: ${error.message}`);
    return c.json({ error: "Internal server error while updating task" }, 500);
  }
});

// Update task progress
app.patch("/make-server-a668dfd7/tasks/:taskId/progress", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      console.log(`Unauthorized access during update progress: ${userError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const taskId = c.req.param('taskId');
    const { progress } = await c.req.json();

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return c.json({ error: "Progress must be a number between 0 and 100" }, 400);
    }

    const existingTask = await kv.get(`task:${user.id}:${taskId}`);

    if (!existingTask) {
      return c.json({ error: "Task not found" }, 404);
    }

    const updatedTask = {
      ...existingTask,
      progress,
      completed: progress === 100,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`task:${user.id}:${taskId}`, updatedTask);

    return c.json({ task: updatedTask });
  } catch (error) {
    console.log(`Server error updating task progress: ${error.message}`);
    return c.json({ error: "Internal server error while updating progress" }, 500);
  }
});

// Delete a task
app.delete("/make-server-a668dfd7/tasks/:taskId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      console.log(`Unauthorized access during delete task: ${userError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const taskId = c.req.param('taskId');
    const existingTask = await kv.get(`task:${user.id}:${taskId}`);

    if (!existingTask) {
      return c.json({ error: "Task not found" }, 404);
    }

    await kv.del(`task:${user.id}:${taskId}`);

    return c.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(`Server error deleting task: ${error.message}`);
    return c.json({ error: "Internal server error while deleting task" }, 500);
  }
});

Deno.serve(app.fetch);