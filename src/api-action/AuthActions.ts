import { Dispatch } from 'redux';
import AuthActions from '../redux/actions/AuthAction';
import apiClient from '../services/api-config';
import { AxiosResponse, AxiosError } from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

export const Login = (authProps: LoginCredentials) => {
  return async (dispatch: Dispatch) => {
    await apiClient
      .post('/login', authProps)
      .then((res: AxiosResponse) => {
        dispatch({
          type: AuthActions.USER_LOGGED_DATA,
          payload: res.data,
        });
      })
      .catch((error: AxiosError) => {
        dispatch({
          type: AuthActions.USER_LOGGED_ERROR,
          payload: error.response?.data,
        });
      });
  };
};
