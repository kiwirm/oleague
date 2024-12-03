import { Result } from "@/lib/import-results";

const MemberSelect = ({ result }: { result: Result }) => (
  <select
    name={result.id}
    defaultValue={undefined}
    className="px-3 py-2 rounded border border-gray-300 w-auto flex-1"
  >
    <option hidden disabled>
      Select a member...
    </option>
    <option>Not a member</option>
    {result.potentialMatches.map((match) => (
      <option key={match.item.onz_id} value={match.item.onz_id}>
        {match.item.full_name}
      </option>
    ))}
  </select>
);

const GradeSelect = ({
  classResult,
}: {
  classResult: {
    potentialMatches: { name: string; grade_id: string }[];
    match: string | null;
    name: string;
    id: string;
  };
}) => (
  <select
    name={classResult.id}
    defaultValue={classResult.match ? classResult.match : "Select a grade..."}
    className="px-3 py-2 rounded border border-gray-300 w-auto flex-1"
  >
    <option hidden disabled>
      Select a grade...
    </option>
    <option>Not a ranked grade</option>
    {classResult.potentialMatches.map((grade) => (
      <option key={grade.grade_id} value={grade.grade_id}>
        {grade.name}
      </option>
    ))}
  </select>
);

const MatchInfo = ({ results }: { results: Result[] }) => (
  <>
    <div className="text-xs mb-3">
      Competitors{" "}
      {results
        .filter((result) => result.match)
        .map((result) => result.name)
        .join(", ")}{" "}
      were assigned automatically
    </div>
    <div className="text-xs">
      Competitors{" "}
      {results
        .filter(
          (result) => result.match === null && !result.potentialMatches.length
        )
        .map((result) => result.name)
        .join(", ")}{" "}
      could not be assigned
    </div>
  </>
);

const MemberAssign = ({
  resultsUploadResponse,
}: {
  resultsUploadResponse: resultsUploadResponse;
}) => (
  <>
    {resultsUploadResponse.parsedResults.race
      .filter((classResult) => classResult.results)
      .map((classResult) => (
        <div key={classResult.name}>
          <h1 className="text-xl font-bold">{classResult.name}</h1>
          <label>Select grade:</label>
          <GradeSelect classResult={classResult} />
          <div>
            <div>
              {classResult.results
                .filter(
                  (result) =>
                    result.match === null && result.potentialMatches.length
                ) // only show unmatched results
                .map((result) => (
                  <div
                    key={result.id}
                    className="flex flex-row justify-between items-center my-2"
                  >
                    <label className="flex-1 text-lg">{result.name}</label>
                    <MemberSelect result={result} />
                  </div>
                ))}
            </div>
            <div>
              {
                classResult.results
                  .filter((result) => result.match)
                  .map((result) => (
                    <input
                      type="hidden"
                      key={result.id}
                      name={result.id}
                      value={result.match!}
                    />
                  )) //hidden input for matched results
              }
            </div>
            <MatchInfo results={classResult.results} />
          </div>
        </div>
      ))}
  </>
);

export default MemberAssign;
