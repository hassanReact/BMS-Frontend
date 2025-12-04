import axios from 'axios';
// import { decryptWithAESKey } from 'common/decrypt';
import { decryptWithAESKey } from '@/core/crypto/decrypt';


export const postApi = async (url, data, headers = {}) => {
  try {
    const isFormData = data instanceof FormData;

    const defaultHeaders = isFormData
      ? { ...headers } // Let Axios auto-set Content-Type + boundary
      : { 'Content-Type': 'application/json', ...headers };

    const response = await axios.post(url, data, { headers: defaultHeaders });

    const responseData = await decryptWithAESKey(response.data);
    return JSON.parse(responseData);
  } catch (error) {
    console.error('API Error:', error.response || error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const getApi = async (url, params = {}, headers = {}) => {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    const response = await axios.get(url, {
      headers: defaultHeaders,
      params: params
    });
    let responseData = await decryptWithAESKey(response.data)
    return JSON.parse(responseData);
  } catch (error) {
    console.error('API Error:', error.response || error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const updateApi = async (url, data = {}, params = {}, headers = {}) => {
  try {
    const isFormData = data instanceof FormData;

    const defaultHeaders = isFormData
      ? { ...headers } // Let Axios handle multipart/form-data headers with boundaries
      : { 'Content-Type': 'application/json', ...headers };

    const response = await axios.put(url, data, {
      headers: defaultHeaders,
      params
    });

    const responseData = await decryptWithAESKey(response.data);
    return JSON.parse(responseData);
  } catch (error) {
    console.error('API Error:', error.response || error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};


export const patchApi = async (url, data = {}, params = {}, headers = {}) => {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    const response = await axios.patch(url, data, {
      headers: defaultHeaders,
      params
    });
    let responseData = await decryptWithAESKey(response.data)
    return JSON.parse(responseData);
  } catch (error) {
    console.error('API Error:', error.response || error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const deleteApi = async (url, params = {}, headers = {}) => {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };

    const response = await axios.delete(url, {
      headers: defaultHeaders,
      params
    });

    let responseData = await decryptWithAESKey(response.data)
    return JSON.parse(responseData);

  } catch (error) {
    console.error('API Error:', error.response || error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};
