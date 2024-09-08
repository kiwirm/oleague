"use server";

import prisma from "@/lib/prisma";
import { xml2json } from "xml-js";
import Fuse, { FuseResult } from "fuse.js";
import { readFileSync, write, writeFile, writeFileSync } from "fs";
import { race, result_status_result_id } from "@prisma/client";
import { ResultList } from "@/types/iofxml";
import { Prisma } from "@prisma/client";

export interface resultsUploadResponse {
  persistence: {
    league_id: string;
    season_id: string;
    file: ResultList;
  };
  races: race[];
  parsedResults: {
    eventName: string;
    creator: string;
    xmlns: string;
    date: Date;
    race: {
      name: string;
      id: string;
      match: string | null;
      potentialMatches: {
        name: string;
        grade_id: string;
      }[];
      results: Result[];
    }[];
  };
}

export interface Result {
  id: string;
  name: string;
  match: number | null;
  potentialMatches: FuseResult<{ onz_id: number; full_name: string | null }>[];
}

const parseResults = async (results: File): Promise<ResultList> =>
  JSON.parse(xml2json(await results.text(), { compact: true }));

export const handleResultsFile = async (
  currentState: any,
  formData: FormData
) => {
  console.log(formData);
  const results = await parseResults(formData.get("file") as File);

  const members = await prisma.member.findMany({
    where: { membership_year: "2024" },
    include: {
      orienteer: {
        select: {
          full_name: true,
          onz_id: true,
        },
      },
    },
  });

  const [league_id, season_id] = (
    formData.get("league_id_and_season_id") as string
  ).split("|");

  const grades = await prisma.grade.findMany({
    where: {
      league_id: league_id,
      season_id: season_id,
    },
    select: {
      grade_id: true,
      name: true,
    },
  });

  const races = await prisma.race.findMany({
    where: {
      league_id: league_id,
      season_id: season_id,
    },
  });

  const fuse = new Fuse(
    members.map((member) => member.orienteer),
    {
      keys: ["full_name"],
      threshold: 0.3,
      includeScore: true,
    }
  );

  return {
    persistence: {
      league_id: league_id,
      season_id: season_id,
      file: results,
    },
    races: races,
    parsedResults: {
      eventName: results.ResultList.Event.Name._text,
      creator: results.ResultList._attributes.creator,
      xmlns: results.ResultList._attributes.xmlns,
      date: new Date(results.ResultList.Event.StartTime.Date._text),
      race: results.ResultList.ClassResult.map((classResult) => ({
        name: classResult.Class.Name._text,
        id: classResult.Class.ShortName._text,
        match:
          grades.filter(
            (grade) => grade.name === classResult.Class.Name._text
          )[0]?.grade_id ||
          grades.filter(
            (grade) => grade.grade_id === classResult.Class.ShortName._text
          )[0]?.grade_id ||
          null,
        potentialMatches: grades,
        results: classResult.PersonResult.map((personResult) => {
          const fullName =
            personResult.Person.Name.Given._text +
            " " +
            personResult.Person.Name.Family._text;

          const matches = fuse.search(fullName);

          return {
            id: personResult.Person.Id._text,
            name: fullName,
            match:
              matches.length && matches[0].score
                ? matches[0].score < 0.05
                  ? matches[0].item.onz_id
                  : null
                : null,
            potentialMatches: matches,
          };
        }),
      })),
    },
  };
};

export const handleResultsImport = async (
  resultsUploadResponse: {
    file: ResultList;
    season_id: string;
    league_id: string;
  },
  currentState: any,
  formData: FormData
) => {
  console.log("resultsUploadResponse", resultsUploadResponse);
  console.log("currentState", currentState);
  console.log("formData", formData);
  const results = resultsUploadResponse.file;

  const [event_number, race_number] = (
    formData.get("event_number_and_race_number") as string
  ).split("|");

  const [response_grade_mapping, response_result] = await prisma.$transaction([
    prisma.grade_mapping.createMany({
      data: results.ResultList.ClassResult.filter(
        (classResult) =>
          formData.get(classResult.Class.ShortName._text) !==
            "Not a ranked grade" &&
          formData.get(classResult.Class.ShortName._text) !== null
      ).map((classResult) => ({
        league_id: resultsUploadResponse.league_id,
        season_id: resultsUploadResponse.season_id,
        event_number: +event_number,
        race_number: +race_number,
        race_grade: classResult.Class.ShortName._text,
        grade_id: formData.get(classResult.Class.ShortName._text) as string,
      })),
    }),
    prisma.result.createMany({
      data: results.ResultList.ClassResult.filter(
        (classResult) =>
          formData.get(classResult.Class.ShortName._text) !==
            "Not a ranked grade" &&
          formData.get(classResult.Class.ShortName._text) !== null
      ).flatMap((classResult) =>
        classResult.PersonResult.filter(
          (personResult) =>
            formData.get(personResult.Person.Id._text) !== "Not a member" &&
            formData.get(personResult.Person.Id._text) !== null
        ).map((personResult) => ({
          league_id: resultsUploadResponse.league_id,
          season_id: resultsUploadResponse.season_id,
          event_number: +event_number,
          race_number: +race_number,
          onz_id: +formData.get(personResult.Person.Id._text)!,
          race_grade: classResult.Class.ShortName._text,
          status_result_id: {
            OK: result_status_result_id.OK,
            MissingPunch: result_status_result_id.MP,
            DidNotFinish: result_status_result_id.DNF,
            DidNotStart: result_status_result_id.DNS,
          }[personResult.Result.Status._text],
          time: personResult.Result.Time
            ? +personResult.Result.Time._text
            : null,
          raw_score: personResult.Result.Score
            ? +personResult.Result.Score
            : null,
          score: personResult.Result.FinalScore
            ? +personResult.Result.FinalScore
            : null,
        }))
      ),
    }),
  ]);
  return {
    response_grade_mapping,
    response_result,
  };
};
