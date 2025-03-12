import * as camaro from "camaro"; // comment this when building for production

const resultListTemplate = {
  name: "ResultList/Event/Name",
  date: "ResultList/Event/StartTime/Date",
  status: "ResultList/@status",
  creator: "ResultList/@creator",
  createTime: "ResultList/@createTime",
  dataVersion: "number(ResultList/@iofVersion)",
  grades: [
    "//ClassResult",
    {
      id: "Class/ShortName",
      name: "Class/Name",
      xml_id: "number(Class/Id)",
      results: [
        "PersonResult",
        {
          competitor: {
            firstName: "Person/Name/Given",
            lastName: "Person/Name/Family",
            sex: "Person/@sex",
            club: {
              name: "Organisation/Name",
              xml_id: "number(Organisation/Id)",
            },
            xml_id: "number(Person/Id)",
          },
          result: {
            startTime: "Result/StartTime",
            finishTime: "Result/FinishTime",
            runningTime: "number(Result/Time)",
            score: "number(Result/Score)",
            penalties: "number(Result/Penalties)",
            finalScore: "number(Result/FinalScore)",
            status: "Result/Status",
            position: "number(Result/Position)",
            splits: [
              "SplitTime",
              {
                controlCode: "number(ControlCode)",
                status: "@status",
                time: "number(Time)",
              },
            ],
          },
        },
      ],
    },
  ],
};

interface Result {
  competitor: {
    firstName: string;
    lastName: string;
    sex: "M" | "F";
    club: {
      name: string;
      xml_id: number;
    };
    xml_id: number;
  };
  result: {
    startTime: Date;
    fnishTime: Date;
    runningTime: number;
    score: number;
    penalties: number;
    finalScore: number;
    status:
      | "OK"
      | "Finished"
      | "MissingPunch"
      | "Disqualified"
      | "DidNotFinish"
      | "Active"
      | "Inactive"
      | "OverTime"
      | "SportingWithdrawal"
      | "NotCompeting"
      | "Moved"
      | "MovedUp"
      | "DidNotStart"
      | "DidNotEnter"
      | "Cancelled";
    position: number;
    splits: [
      {
        controlCode: number;
        status: "OK" | "Missing" | "Additional";
        time: number;
      }
    ];
  };
}

interface Grade {
  id: string;
  name: string;
  xml_id: number;
  results: Result[];
}

interface ResultList {
  name: string;
  date: Date;
  status: "Complete" | "Delta" | "Snapshot";
  creator: string;
  createTime: Date;
  dataVersion: number;
  grades: Grade[];
}

const parseIOFXmlResultList = async (results: File): Promise<ResultList> => {
  const text = await results.text();
  const resultList = await camaro.transform(text, resultListTemplate);
  //convert date strings to dates
  return {
    ...resultList,
    createTime: new Date(resultList.createTime),
    grades: resultList.grades.map(
      (grade: { results: [{ startTime: string; finishTime: string }] }) => ({
        ...grade,
        results: grade.results.map((result) => ({
          ...result,
          startTime: new Date(result.startTime),
          finishTime: new Date(result.finishTime),
        })),
      })
    ),
  };
};

export { parseIOFXmlResultList, resultListTemplate };
export type { Grade, Result, ResultList };
