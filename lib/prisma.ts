import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GradeIncludeAll = Prisma.validator<Prisma.gradeDefaultArgs>()({
  include: {
    competitor: {
      include: {
        points: true,
        orienteer: true,
      },
    },
    season: {
      include: {
        event: {
          include: {
            race: true,
          },
        },
      },
    },
  },
});

export const seasonsWithLeagues = Prisma.validator<Prisma.seasonDefaultArgs>()({
  include: { league: true },
});

export const eventWithRaces = Prisma.validator<Prisma.eventDefaultArgs>()({
  include: { race: true },
});

export const competitorExtended =
  Prisma.validator<Prisma.competitorDefaultArgs>()({
    include: {
      points_dense: true,
      orienteer: true,
    },
  });

export default prisma;
