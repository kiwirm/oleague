import { GradeMatch, ResultMatch, UploadResponse } from "@/lib/handle-results";

const MemberSelect = ({ match }: { match: ResultMatch }) => (
  <select
    name={match.xml_id.toString()}
    defaultValue={undefined}
    className="px-3 py-2 rounded border border-gray-300 w-auto flex-1"
  >
    <option hidden disabled>
      Select a member...
    </option>
    <option>Not a member</option>
    {match.match_close.map((closeMatch) => (
      <option key={closeMatch.match.id} value={closeMatch.match.id}>
        {closeMatch.match.name}
      </option>
    ))}
  </select>
);

const GradeSelect = ({ match }: { match: GradeMatch }) => (
  <select
    name={match.xml_id.toString()}
    defaultValue={match.match_id ? match.match_id : "Select a grade..."}
    className="px-3 py-2 rounded border border-gray-300 w-auto flex-1"
  >
    <option hidden disabled>
      Select a grade...
    </option>
    <option>Not a ranked grade</option>
    {match.match_close.map((closeMatch) => (
      <option key={closeMatch} value={closeMatch}>
        {closeMatch}
      </option>
    ))}
  </select>
);

// const MatchInfo = ({ results }: { results: Result[] }) => (
//   <>
//     <div className="text-xs mb-3">
//       Competitors{" "}
//       {results
//         .filter((result) => result.match)
//         .map((result) => result.name)
//         .join(", ")}{" "}
//       were assigned automatically
//     </div>
//     <div className="text-xs">
//       Competitors{" "}
//       {results
//         .filter(
//           (result) => result.match === null && !result.potentialMatches.length
//         )
//         .map((result) => result.name)
//         .join(", ")}{" "}
//       could not be assigned
//     </div>
//   </>
// );

const MemberAssign = ({
  uploadResponse,
}: {
  uploadResponse: UploadResponse;
}) => (
  <>
    {uploadResponse.payload.resultList.grades
      .filter((grade) => grade.results.length)
      .map((grade) => (
        <div key={grade.name}>
          <h1 className="text-xl font-bold">{grade.name}</h1>
          <label>Select grade:</label>
          <GradeSelect
            match={
              uploadResponse.matches.grades.find(
                (match) => match.xml_id === grade.xml_id
              )!
            }
          />
          <div>
            {grade.results.map((result) => {
              const match = uploadResponse.matches.results.find(
                (match) => match.xml_id === result.competitor.xml_id
              )!;
              console.log(match);
              const competitorName = `${result.competitor.firstName} ${result.competitor.lastName}`;
              return match.match_perfect ? (
                <input
                  type="hidden"
                  key={result.competitor.xml_id}
                  name={result.competitor.xml_id.toString()}
                  value={match.match_perfect.id}
                />
              ) : match.match_close.length ? (
                <div
                  key={result.competitor.xml_id}
                  className="flex flex-row justify-between items-center my-2"
                >
                  <label className="flex-1 text-lg">{competitorName}</label>
                  <MemberSelect match={match} />
                </div>
              ) : null;
            })}
          </div>
        </div>
      ))}
  </>
);

export default MemberAssign;
