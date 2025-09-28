import AuthActions from '../actions/AuthAction';

const initialState = {
  userData: {},
  userLogError: {},
  userType: '',
  userId: '',
};

export default function AdminAuthData(state = initialState, action:any) {
  switch (action.type) {
    case AuthActions.USER_LOGGED_DATA:
      return { ...state, userData: action?.payload };
    case AuthActions.USER_LOGGED_ERROR:
      return { ...state, userLogError: action?.payload };
    default:
      return { ...state };
  }
}
