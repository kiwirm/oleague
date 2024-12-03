import Subtitle from "@/components/subtitle";

import { resultsUploadResponse } from "@/lib/import-results";

import Link from "next/link";

import MemberAssign from "./import-member-assign";

const RaceSelect = ({
  resultsUploadResponse,
}: {
  resultsUploadResponse: resultsUploadResponse;
}) => (
  <select
    name="event_number_and_race_number"
    className="px-3 py-2 rounded border border-gray-300 w-auto flex-1"
    defaultValue="Select a race..."
  >
    <option hidden disabled>
      Select a race...
    </option>
    {resultsUploadResponse.races.map((race) => (
      <option
        key={race.event_number + "_" + race.race_number}
        value={race.event_number + "|" + race.race_number}
      >
        {"Event " +
          race.event_number +
          " race " +
          race.race_number +
          " at " +
          race.map}
      </option>
    ))}
  </select>
);

const ImportSuccess = ({ importResponse }) => (
  <div>
    <p>Success</p>
    <p>Imported {importResponse.response_grade_mapping.count} grades</p>
    <p>Imported {importResponse.response_result.count} results</p>
    <p className="mt-5">
      <Link href="/" className="text-gray-500">
        Return to home
      </Link>
    </p>
  </div>
);

const ImportForm = ({
  importResponse,
  importPending,
  payload,
}: {
  payload: resultsUploadResponse;
}) => (
  <div>
    <Subtitle>Import Results</Subtitle>
    (importResponse ? (
    <ImportSuccess importResponse={importResponse} />) : (
    <>
      <Subtitle>Select race</Subtitle>
      <RaceSelect resultsUploadResponse={resultsUploadResponse} />
      <Subtitle>Assign competitors to members</Subtitle>
      <MemberAssign resultsUploadResponse={resultsUploadResponse} />
    </>
    ))
    {importPending && <div>Importing results...</div>}
  </div>
);

export default ImportForm;
