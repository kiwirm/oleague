"use server";

import { Prisma, race, result_status_result_id, scorer } from "@prisma/client";
import { parseIOFXmlResultList, ResultList } from "./iof-xml";
import prisma from "./prisma";

import fuzzyMatch from "./fuzzy-match";

const getMemberAndGradeSubset = async (
  league_id: string,
  season_id: string
) => {
  const members = await prisma.member.findMany({
    where: { membership_year: "2024" }, //TODO: fix member hardcoding
    include: {
      orienteer: {
        select: {
          full_name: true,
          onz_id: true,
        },
      },
    },
  });
  const grades = await prisma.grade.findMany({
    where: {
      league_id,
      season_id,
    },
    select: {
      grade_id: true,
      name: true,
    },
  });

  return {
    members,
    grades,
  };
};

export interface GradeMatch {
  xml_id: number;
  match_id: string | null;
  match_close: string[];
}

export interface ResultMatch {
  xml_id: number;
  match_perfect: {
    name: string;
    id: number;
  } | null;
  match_close: {
    score: number;
    match: {
      name: string;
      id: number;
    };
  }[];
}

export interface UploadResponse {
  payload: {
    season_id: string;
    league_id: string;
    resultList: ResultList;
  };
  scorers: scorer[];
  races: race[];
  matches: {
    grades: GradeMatch[];
    results: ResultMatch[];
  };
}

export type ImportResponse = {
  response_grade_mapping: Prisma.BatchPayload;
  response_result: Prisma.BatchPayload;
};

export const handleUpload = async (currentState: any, formData: FormData) => {
  const resultList = await parseIOFXmlResultList(formData.get("file") as File);

  const [league_id, season_id] = (
    formData.get("league_id_and_season_id") as string
  ).split("|");
  const subset = await getMemberAndGradeSubset(league_id, season_id);

  const races = await prisma.race.findMany({
    where: {
      league_id,
      season_id,
    },
  });

  const scorers = await prisma.scorer.findMany()

  //match grades
  const matchedGrades = resultList.grades.map((xml_grade) => ({
    xml_id: xml_grade.xml_id,
    match_id:
      subset.grades.find((grade) => grade.name === xml_grade.name)?.grade_id ||
      subset.grades.find((grade) => grade.grade_id === xml_grade.id)
        ?.grade_id ||
      null,
    match_close: subset.grades.map((grade) => grade.grade_id), // just get all grades
  }));

  const orienteerNames = subset.members.map((member) => ({
    competitorName: member.orienteer.full_name!,
    competitorId: member.orienteer.onz_id,
  }));
  const matchedResults = resultList.grades.flatMap((grade) =>
    grade.results.map((result) => {
      const matches = fuzzyMatch(
        orienteerNames,
        `${result.competitor.firstName} ${result.competitor.lastName}`
      );

      return {
        xml_id: result.competitor.xml_id,
        match_perfect:
          matches[0] && matches[0].score! < 0.05 ? matches[0].match : null,
        match_close: matches,
      };
    })
  );

  return {
    payload: {
      season_id,
      league_id,
      resultList,
    },
    races,
    scorers,
    matches: {
      grades: matchedGrades,
      results: matchedResults,
    },
  };
};

export const handleImport = async (
  payload: {
    season_id: string;
    league_id: string;
    resultList: ResultList;
  },
  currentState: any,
  formData: FormData
) => {
  const { season_id, league_id, resultList } = payload;
  const subset = await getMemberAndGradeSubset(league_id, season_id);

  const [event_number, race_number] = (
    formData.get("event_number_and_race_number") as string
  )
    .split("|")
    .map((id) => +id);

  const getMatched = (id: any) => formData.get(String(id)) as string | null;

  const [response_grade_mapping, response_result] = await prisma.$transaction([
    // Create grades
    prisma.grade_mapping.createMany({
      data: resultList.grades
        .filter((grade) =>
          subset.grades
            .map((grade) => grade.grade_id)
            .includes(getMatched(grade.xml_id) as string)
        )
        .map((grade) => ({
          season_id,
          league_id,
          event_number,
          race_number,
          race_grade: grade.id,
          grade_id: getMatched(grade.xml_id)!, //TODO: remove force not null
        })),
    }),

    // Create results
    prisma.result.createMany({
      data: resultList.grades
        .filter((grade) =>
          subset.grades
            .map((grade) => grade.grade_id)
            .includes(getMatched(grade.xml_id) as string)
        )
        .flatMap((grade) =>
          grade.results
            .filter((result) =>
              subset.members
                .map((member) => member.onz_id.toString())
                .includes(getMatched(result.competitor.xml_id) as string)
            )
            .filter(
              (result) =>
                ![
                  "DidNotStart",
                  "Inactive",
                  "NotCompeting",
                  "Moved",
                  "MovedUp",
                  "DidNotEnter",
                  "Cancelled",
                ].includes(result.result.status)
            )
            .map((result) => ({
              season_id,
              league_id,
              event_number,
              race_number,
              race_grade: grade.id,
              scorer_id: getMatched(grade.id + "_scorer")!,
              onz_id: +(getMatched(result.competitor.xml_id) as string),
              status_result_id: {
                OK: result_status_result_id.OK,
                Finished: result_status_result_id.OK,
                Active: result_status_result_id.OK,
                MissingPunch: result_status_result_id.MP,
                DidNotFinish: result_status_result_id.DNF,
                OverTime: result_status_result_id.DNF,
                Disqualified: result_status_result_id.DQ,
              }[
                result.result.status as
                  | "OK"
                  | "Finished"
                  | "Active"
                  | "MissingPunch"
                  | "DidNotFinish"
                  | "OverTime"
                  | "Disqualified"
              ],
              time: result.result.runningTime,
              raw_score: result.result.score,
              score: result.result.score, // find difference between these
            }))
        ),
    }),
  ]);
  return {
    response_grade_mapping,
    response_result,
  };
};
