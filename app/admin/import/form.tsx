"use client";

import { Button } from "@/components/button";

import { handleImport, handleUpload } from "@/lib/handle-results";
import { seasonsWithLeagues } from "@/lib/prisma";

import { Prisma } from "@prisma/client";

import { useActionState } from "react";

import ImportForm from "./import";
import UploadForm from "./upload";

const ResultsForm = ({
  seasons,
}: {
  seasons: Prisma.seasonGetPayload<typeof seasonsWithLeagues>[];
}) => {
  const [uploadResponse, uploadAction, uploadPending] = useActionState(
    handleUpload,
    null
  );
  const [importResponse, importAction, importPending] = useActionState(
    handleImport.bind(null, uploadResponse?.payload!),
    null
  );
  return (
    <form
      action={uploadResponse ? importAction : uploadAction}
      className="grid gap-4 max-w-screen-lg mx-auto"
    >
      <UploadForm
        uploadResponse={uploadResponse}
        uploadPending={uploadPending}
        payload={seasons}
      />

      {uploadResponse && (
        <ImportForm
          importResponse={importResponse}
          importPending={importPending}
          payload={uploadResponse}
        />
      )}

      {(!uploadResponse || !importResponse) && (
        <Button disabled={uploadPending || importPending}>
          {uploadResponse ? "Import Results" : "Upload File"}
        </Button>
      )}
    </form>
  );
};

export default ResultsForm;
