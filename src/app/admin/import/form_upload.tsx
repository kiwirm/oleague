import React from "react";
import PageSubtitle from "@/components/page_subtitle";
import { Result } from "@/actions/import_results";

import { FuseResult } from "fuse.js";
import { seasonsWithLeagues } from "./form";
import { Prisma } from "@prisma/client";

export default function FormUpload({
  seasons,
}: {
  seasons: Prisma.seasonGetPayload<typeof seasonsWithLeagues>[];
}) {
  return (
    <>
      <PageSubtitle>Select season</PageSubtitle>
      <select
        required
        name="league_id_and_season_id"
        className="px-3 py-2 rounded border border-gray-300 w-auto flex-1"
        defaultValue="Select a season..."
      >
        <option hidden disabled>
          Select a season...
        </option>
        {seasons.map((season) => (
          <option
            key={season.league_id + season.season_id}
            value={season.league.league_id + "|" + season.season_id}
          >
            {season.season_id + " " + season.league.name + " Season"}
          </option>
        ))}
      </select>
      <PageSubtitle>Upload results file</PageSubtitle>
      <input
        name="file"
        type="file"
        // hidden={results ? true : false}
        className="px-3 py-2 rounded border border-gray-300"
      />
    </>
  );
}
