const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { initWebSocket } = require("./ws");

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });
console.log(`Running in ${env} mode`);

const routes = require("./routes");
const config = require("./config");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/fr", routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

const server = http.createServer(app);

initWebSocket(server);

const PORT = config.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



