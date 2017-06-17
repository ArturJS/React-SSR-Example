import axios from 'axios';
import {config} from './apiConfig';

const baseApi = {
  ajax(request) {
    const promise = axios({...config, ...request});

    promise
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.error(error);
      });

    return promise;
  }
};

export default baseApi;
