export type ResultList = {
  _declaration: {
    _attributes: {
      version: string;
      encoding: string;
    };
  };
  ResultList: {
    _attributes: {
      status: string;
      creator: string;
      createTime: string;
      iofVersion: string;
      "xmlns:xsi": string;
      xmlns: string;
    };
    Event: {
      Name: {
        _text: string;
      };
      StartTime: {
        Date: {
          _text: string;
        };
        Time: {
          _text: string;
        };
      };
      EndTime: {
        Date: {
          _text: string;
        };
        Time: {
          _text: string;
        };
      };
    };
    ClassResult: Array<{
      Class: {
        Id: {
          _text: string;
        };
        Name: {
          _text: string;
        };
        ShortName: {
          _text: string;
        };
        _comment?: string;
      };
      Course: {
        Length: {
          _text: string;
        };
      };
      PersonResult: Array<{
        Person: {
          _attributes: {
            sex: string;
          };
          Id: {
            _text: string;
          };
          Name: {
            Family: {
              _text: string;
            };
            Given: {
              _text: string;
            };
          };
        };
        Result: {
          BibNumber?: {
            _text: string;
          };
          Position: {
            _text: string;
          };
          Score?: {
            _text: string;
          };
          Penalties?: {
            _text: string;
          };
          FinalScore?: {
            _text: string;
          };
          Status: {
            _text: string;
          };
          ControlCard: {
            _text: string;
          };
          StartTime?: {
            _text: string;
          };
          FinishTime?: {
            _text: string;
          };
          Time?: {
            _text: string;
          };
          TimeBehind?: {
            _text: string;
          };
          SplitTime?: Array<{
            _attributes: {
              status: string;
            };
            ControlCode: {
              _text: string;
            };
            Time?: {
              _text: string;
            };
          }>;
        };
        Organisation?: {
          Id?: {
            _text: string;
          };
          Name: {
            _text: string;
          };
          ShortName: {
            _text: string;
          };
        };
      }>;
    }>;
  };
};
