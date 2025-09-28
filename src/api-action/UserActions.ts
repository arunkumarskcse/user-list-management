import { Dispatch } from 'redux';
import UserAction from '../redux/actions/UserAction';
import apiClient from '../services/api-config';
import { AxiosResponse, AxiosError } from 'axios';

// POST Method
export const postUsers = (data: any) => {

    console.log("data in action : ", data);

    return async (dispatch: Dispatch) => {

        await apiClient
            .post('/users', data)
            .then((res: AxiosResponse) => {
                dispatch({
                    type: UserAction.POST_USER_DATA,
                    payload: res?.data?.data,
                });
            })
            .catch((error: AxiosError) => {
                dispatch({
                    type: UserAction.POST_USER_ERROR,
                    payload: error?.response?.data,
                });
            });
    };

};

// GET Method
export const getUsers = () => {

    return async (dispatch: Dispatch) => {
        await apiClient.get('/users').then((res) => {
            dispatch({
                type: UserAction.GET_USERS_DATA,
                payload: res?.data?.data,
            });
        })
            .catch((error) => {
                dispatch({
                    type: UserAction.GET_USERS_ERROR,
                    payload: error?.response?.data,
                });
            });
    };

};

// GET Method by ID
export const getUserById = (id: string) => {

    return async (dispatch: Dispatch) => {

        await apiClient.get(`/users/${id}`).then((res) => {
            dispatch({
                type: UserAction.GET_USER_BY_ID_DATA,
                payload: res?.data?.data,
            });
        })
            .catch((error) => {
                dispatch({
                    type: UserAction.GET_USER_BY_ID_ERROR,
                    payload: error?.response?.data,
                });
            });
    };

}

// Edit Method
export const editUser = (id:any, data:any) => {
  return async (dispatch: Dispatch) => {
    await apiClient
      .patch(`admin/edit-admin-details/${id}`, data)
      .then((res) => {
        dispatch({
          type: UserAction.EDIT_USER_DATA,
          payload: res?.data?.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: UserAction.EDIT_USER_ERROR,
          payload: error?.response?.data,
        });
      });
  };
};