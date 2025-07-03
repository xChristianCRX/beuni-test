import 'dotenv/config';
import express from "express"
import cors from "cors"
import { PrismaClient } from "@prisma/client"
import routes from './routes/index.js';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", routes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});