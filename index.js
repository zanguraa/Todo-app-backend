import express, { response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: "postgresdb",
  user: "postgres",
  password: "my_postgres_password",
  database: "postgres",
  port: 5432,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const body = req.body;
  console.log(body);
  const client = await pool.connect();
  const result = await client.query({
    text: `INSERT INTO todo_app
     (text, status) 
     VALUES ($1, $2);`,
    values: [body.text, body.status],
  });
  console.log(req.body);
  const select = await client.query({
    text: "SELECT * FROM todo_app ORDER BY id DESC;",
  });

  res.send(select);
});

app.put("/:id", async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  console.log(body);
  const client = await pool.connect();

  const result = await client.query({
    text: `UPDATE todo_app
     SET status = $1 WHERE id = $2`,
    values: [body.status, id],
  });
});

app.get("/", async (req, res) => {
  const client = await pool.connect();
  const result = await client.query({
    text: "SELECT * FROM todo_app ORDER BY id DESC;",
  });
  return res.json(result.rows);
});

app.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const client = await pool.connect();
  const result = await client.query({
    text: `DELETE FROM todo_app WHERE id = ${id}`,
  });
  res.send("deleted");
});

app.listen(3000, () => {
  console.log("app listening to 3000");
});
