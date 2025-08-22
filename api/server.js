import express from "express"; import pkg from "pg";
const { Pool } = pkg; const app = express(); app.use(express.json());
const pool = new Pool({ connectionString: process.env.DB_URL });
app.get("/healthz", (_, res) => res.send("ok"));
app.post("/topics", async (req, res) => {
  const { title, choices } = req.body;
  const t = await pool.query("insert into topics(title) values($1) returning id", [title]);
  const id = t.rows[0].id;
  await Promise.all(choices.map(c => pool.query("insert into choices(topic_id,text) values($1,$2)", [id, c])));
  res.json({ id });
});
app.post("/votes", async (req, res) => {
  const { choice_id } = req.body;
  await pool.query("insert into votes(choice_id) values($1)", [choice_id]);
  res.json({ ok: true });
});
app.get("/topics/:id", async (req, res) => {
  const { rows } = await pool.query(
    "select c.id, c.text, count(v.id)::int as votes from choices c left join votes v on v.choice_id=c.id where c.topic_id=$1 group by c.id order by c.id",
    [req.params.id]
  ); res.json(rows);
});
app.listen(3000);
