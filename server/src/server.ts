import express from "express";
import { PrismaClient } from "@prisma/client";

import cors from "cors";
import { convertHourStringToMinutes } from "./utils/convertHourStringToMinutes";

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

app.post("/games/:id/ads", async (request, response) => {
  const gameId = request.params.id;
  const body = request.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(","),
      hourStart: convertHourStringToMinutes(body.hourStart),
      hourEnd: convertHourStringToMinutes(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,
    },
  });

  return response.status(201).json(ad);
});

app.listen(3333);
