import Subtitle from "@/components/subtitle";

import { Prisma } from "@prisma/client";

import { UploadResponse } from "@/lib/handle-results";
import { ResultList } from "@/lib/iof-xml";
import { seasonsWithLeagues } from "@/lib/prisma";

const UploadSuccess = ({ resultList }: { resultList: ResultList }) => (
  <table>
    <tbody>
      <tr>
        <td>Event:</td>
        <td>{resultList.name}</td>
      </tr>
      <tr>
        <td>Event Date:</td>
        {/* <td>{resultList.date.toISOString()}</td> */}
      </tr>
      <tr>
        <td>Created by:</td>
        <td>
          {resultList.creator} (IOF XML datastandard {resultList.dataVersion})
        </td>
      </tr>
      <tr>
        <td>Created Time:</td>
        {/* <td>{resultList.createTime.toISOString()}</td> */}
      </tr>
    </tbody>
  </table>
);

const UploadForm = ({
  uploadResponse,
  uploadPending,
  payload,
}: {
  uploadResponse: UploadResponse | null;
  uploadPending: boolean;
  payload: Prisma.seasonGetPayload<typeof seasonsWithLeagues>[];
}) => (
  <div>
    <Subtitle>Upload Results</Subtitle>
    {uploadResponse ? (
      <UploadSuccess resultList={uploadResponse.payload.resultList} />
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
