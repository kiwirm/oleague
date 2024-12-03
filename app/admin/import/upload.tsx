import Subtitle from "@/components/subtitle";

import { Prisma } from "@prisma/client";

import { seasonsWithLeagues } from "@/lib/prisma";

const UploadSuccess = ({ parsedResults }) => (
  //TODO ceebs typing
  <table>
    <tbody>
      <tr>
        <td>Event:</td>
        <td>{parsedResults.eventName}</td>
      </tr>
      <tr>
        <td>Created by:</td>
        <td>
          {parsedResults.creator} (xmlns: {parsedResults.xmlns})
        </td>
      </tr>
      <tr>
        <td>Date:</td>
        <td>{parsedResults.date.toLocaleDateString()}</td>
      </tr>
    </tbody>
  </table>
);

const UploadForm = ({
  uploadResponse,
  uploadPending,
  payload,
}: {
  payload: Prisma.seasonGetPayload<typeof seasonsWithLeagues>[];
}) => (
  <div>
    <Subtitle>Upload Results</Subtitle>
    {uploadResponse ? (
      <UploadSuccess parsedResults={uploadResponse.parsedResults} />
    ) : (
      <>
        <Subtitle>Select season</Subtitle>
        <select
          required
          name="league_id_and_season_id"
          className="px-3 py-2 rounded border border-gray-300 w-auto flex-1"
          defaultValue="Select a season..."
        >
          <option hidden disabled>
            Select a season...
          </option>
          {payload.map((season) => (
            <option
              key={season.league_id + season.season_id}
              value={season.league.league_id + "|" + season.season_id}
            >
              {season.season_id + " " + season.league.name + " Season"}
            </option>
          ))}
        </select>
        <Subtitle>Upload results file</Subtitle>
        <input
          name="file"
          type="file"
          // hidden={results ? true : false}
          className="px-3 py-2 rounded border border-gray-300"
        />
      </>
    )}
    {uploadPending && <div>Uploading file...</div>}
  </div>
);

export default UploadForm;
