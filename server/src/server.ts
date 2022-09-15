import express from "express";
import { PrismaClient } from "@prisma/client";

import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

app.get("/games", async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      //Inner join do Prisma
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });

  return response.json(games);
});

app.listen(3333);
