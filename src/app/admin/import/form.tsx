"use client";

import {
  handleResultsFile,
  handleResultsImport,
} from "@/actions/import_results";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { useActionState } from "react";
import FormImport from "./form_import";
import FormUpload from "./form_upload";

export const seasonsWithLeagues = Prisma.validator<Prisma.seasonDefaultArgs>()({
  include: { league: true },
});

export default function ImportForm({
  seasons,
}: {
  seasons: Prisma.seasonGetPayload<typeof seasonsWithLeagues>[];
}) {
  const [resultsUploadResponse, uploadResultsFile, uploadPending] =
    useActionState(handleResultsFile, null);
  const [importResponse, importResultsFile, importPending] = useActionState(
    handleResultsImport.bind(null, resultsUploadResponse?.persistence!),
    null
  );
  return (
    <form
      action={resultsUploadResponse ? importResultsFile : uploadResultsFile}
      className="grid gap-4 max-w-screen-lg mx-auto"
    >
      {resultsUploadResponse && uploadInfo(resultsUploadResponse.parsedResults)}
      {importResponse && (
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
      )}

      {!resultsUploadResponse && <FormUpload seasons={seasons} />}
      {resultsUploadResponse && !importResponse && (
        <FormImport
          resultsUploadResponse={resultsUploadResponse}
          // importPending={importPending}
        />
      )}

      {uploadPending && <div>Uploading file...</div>}
      {importPending && <div>Importing results...</div>}

      {(!resultsUploadResponse || !importResponse) && (
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          disabled={uploadPending || importPending}
        >
          {resultsUploadResponse ? "Import Results" : "Upload File"}
        </button>
      )}
    </form>
  );
}

const uploadInfo = (parsedResults: any) => (
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
