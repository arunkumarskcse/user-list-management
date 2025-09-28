import UserAction from '../actions/UserAction';

// const initialState = new Map({
//   Users: [],
// });

const initialState = {

  postUserData: {},
  postUserError: {},

  editUserData: {},
  editUserError: {},

  users: [],
  getUsersError: {},
  
};

export default function AdminData(state = initialState, action:any) {
  switch (action.type) {

    // GET Method
    case UserAction.GET_USERS_DATA:
      return { ...state, users: action?.payload };
    case UserAction.GET_USERS_ERROR:
      return { ...state, getUsersError: action?.payload };

    case UserAction.GET_USER_BY_ID_DATA:
      return { ...state, getUsersByIdData: action?.payload };
    case UserAction.GET_USER_BY_ID_ERROR:
      return { ...state, getUsersByIdError: action?.payload };

    // POST Method
    case UserAction.POST_USER_DATA:
      return { ...state, postUserData: action?.payload };
    case UserAction.POST_USER_ERROR:
      return { ...state, postUserError: action?.payload };

    // EDIT Method
    case UserAction.EDIT_USER_DATA:
      return { ...state, editWorkSiteData: action?.payload };
    case UserAction.EDIT_USER_ERROR:
      return { ...state, editWorkSiteError: action?.payload };

    default:
      return { ...state };
  }
}
