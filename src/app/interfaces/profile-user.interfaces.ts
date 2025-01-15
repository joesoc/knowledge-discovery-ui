export interface ProfileUserSuccess {
  action: string;
  response: 'SUCCESS';
  responsedata: {
    newprofile: string;
    pid: string;
    parent: string;
    parentusername: string;
    namedarea: string;
    score: string;
    created: string;
  };
}

export interface ProfileUserError {
  action: string;
  response: 'ERROR';
  responsedata: {
    error: {
      errorid: string;
      rawerrorid: string;
      errorstring: string;
      errordescription: string;
      errorcode: string;
      errortime: string;
    }[];
  };
}

export type ProfileUserResponse = ProfileUserSuccess | ProfileUserError;
