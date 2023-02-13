import {useAppAccount} from '../../hooks';
import {Strings} from '../resources/strings';
import Cookies from 'universal-cookie';

const URL_API = process.env.REACT_APP_API;
// const API_ENDPOINT = 'https://rabiloo-hamic-be.herokuapp.com'; //dev
// const API_ENDPOINT = 'http://192.168.165.46:8080'; //local
const API_ENDPOINT = 'http://3.17.66.155:8080';

const CommonCall = async (api, header) => {
  const STRINGS = Strings[localStorage.getItem('lang')];
  try {
    const cookies = new Cookies();
    const account = cookies.get('account');
    let headers;
    // if (accessToken) {
    headers = {
      Authorization: `Bearer ${account.accessToken}`,
      'Content-Type': 'application/json',
      // Accept: "application/json",
      'Access-Control-Request-Headers': '*',
      'Access-Control-Allow-Origin': '*',
    };
    // } else {
    //   headers = {
    //     Accept: "application/json",
    //   };
    // }
    if (header && (header.method === 'POST' || header.method === 'PUT')) {
      headers = {
        ...headers,
        ...header?.headers,
      };
    }
    let head = {
      ...header,
      headers,
    };
    console.log('head', head);
    const response = await fetch(api, {
      ...head,
      credentials: 'omit',
    });

    if (response.status === 500) {
      return {
        code: response.status,
        message: STRINGS.server_error,
        success: false,
      };
    }
    if (response.status === 200) {
      return await response.json();
    }
    //   if (response.status === 401) {
    //     //refresh token
    //     const resToken = await refreshToken();
    //     console.log("resToken", resToken);
    //     if (resToken.success) {
    //       const newHeaders = {
    //         ...headers,
    //         Authorization: `Bearer ${resToken.access_token}`,
    //         "Content-Type": "application/json",
    //         Accept: "application/json",
    //         "Access-Control-Request-Headers": "*",
    //       };
    //       const newHead = {
    //         ...head,
    //         headers: newHeaders,
    //       };
    //       const responseRefeshToken = await fetch(api, newHead);
    //       const resultRefeshToken = await responseRefeshToken.json();
    //       return resultRefeshToken;
    //     } else {
    //       return {
    //         code: response.code,
    //         success: false,
    //       };
    //     }
    //   } else {
    //     const resJson = await response.json();
    //     return {
    //       code: resJson.status,
    //       message: resJson.message,
    //       success: false,
    //     };
    //   }
  } catch (error) {
    return {
      success: false,
      message: STRINGS.network_error,
    };
  }
};

const FetchApi = {
  getUsers: async size => {
    const header = {
      method: 'GET',
    };
    const api = `${URL_API}?results=${size}`;
    const result = await CommonCall(api, header);
    return result;
  },
  login: async obj => {
    const header = {
      method: 'POST',
      body: JSON.stringify(obj),
    };
    const api = `${API_ENDPOINT}/api/public/login`;
    const result = await CommonCall(api, header);
    return result;
  },
  forgotPassword: async ({email}) => {
    const header = {
      method: 'POST',
    };
    const api = `${API_ENDPOINT}/api/public/forgot-password?email=${email}`;
    const result = await CommonCall(api, header);
    return result;
  },
  deactiveUser: async ({id}) => {
    const header = {
      method: 'DELETE',
    };
    const api = `${API_ENDPOINT}/api/admin/user-deactivate?id=${id}`;
    const result = await CommonCall(api, header);
    return result;
  },
  resetPassword: async ({email, newPassword, token}) => {
    const header = {
      method: 'PUT',
    };
    const api = `${API_ENDPOINT}/api/public/reset-password?email=${email}&newPassword=${newPassword}&token=${token}`;
    const result = await CommonCall(api, header);
    return result;
  },
  registerNewEmail: async ({email}) => {
    const header = {
      method: 'POST',
    };
    const api = `${API_ENDPOINT}/api/public/register?email=${email}`;
    const result = await CommonCall(api, header);
    return result;
  },
  signup: async obj => {
    const header = {
      method: 'POST',
      body: JSON.stringify(obj),
    };
    const api = `${API_ENDPOINT}/api/public/user-create`;
    const result = await CommonCall(api, header);
    return result;
  },
  getUserInfo: async () => {
    const header = {
      method: 'GET',
    };
    const api = `${API_ENDPOINT}/api/user/info`;
    const result = await CommonCall(api, header);
    return result;
  },
  updateInfoUser: async obj => {
    const header = {
      method: 'PUT',
      body: JSON.stringify(obj),
    };
    const api = `${API_ENDPOINT}/api/user/update-user-info`;
    const result = await CommonCall(api, header);
    return result;
  },
  allExam: async () => {
    const header = {
      method: 'GET',
    };
    const api = `${API_ENDPOINT}/api/admin/exam-all`;
    const result = await CommonCall(api, header);
    return result;
  },
  allExamPublic: async () => {
    const header = {
      method: 'GET',
    };
    const api = `${API_ENDPOINT}/api/public/exam-all`;
    const result = await CommonCall(api, header);
    return result;
  },

  deleteExam: async ({id}) => {
    const header = {
      method: 'DELETE',
    };
    const api = `${API_ENDPOINT}/api/admin/exam/exam-delete?id=${id}`;
    const result = await CommonCall(api, header);
    return result;
  },
  createExam: async obj => {
    const header = {
      method: 'POST',
      body: JSON.stringify(obj),
    };
    const api = `${API_ENDPOINT}/api/admin/exam/exam-create`;
    const result = await CommonCall(api, header);
    return result;
  },
  editExam: async obj => {
    const header = {
      method: 'PUT',
      body: JSON.stringify(obj),
    };
    const api = `${API_ENDPOINT}/api/admin/exam/exam-edit`;
    const result = await CommonCall(api, header);
    return result;
  },
  createQuestion: async obj => {
    const header = {
      method: 'POST',
      body: JSON.stringify(obj),
    };
    const api = `${API_ENDPOINT}/api/admin/question/question-create/`;
    const result = await CommonCall(api, header);
    return result;
  },
  updateQuestion: async obj => {
    const header = {
      method: 'PUT',
      body: JSON.stringify(obj),
    };
    const api = `${API_ENDPOINT}/api/admin/question/question-edit`;
    const result = await CommonCall(api, header);
    return result;
  },
  deleteQuestion: async ({questionId}) => {
    const header = {
      method: 'DELETE',
    };
    const api = `${API_ENDPOINT}/api/admin/question/question-delete?id=${questionId}`;
    const result = await CommonCall(api, header);
    return result;
  },
  getDetailExam: async ({examId}) => {
    const header = {
      method: 'GET',
    };
    const api = `${API_ENDPOINT}/api/admin/exam?id=${examId}`;
    const result = await CommonCall(api, header);
    return result;
  },
  getDetailExamUser: async ({examId}) => {
    const header = {
      method: 'GET',
    };
    const api = `${API_ENDPOINT}/api/user/exam?id=${examId}`;
    const result = await CommonCall(api, header);
    return result;
  },
  getDetailExamPublic: async ({examId}) => {
    const header = {
      method: 'GET',
    };
    const api = `${API_ENDPOINT}/api/public/exam?id=${examId}`;
    const result = await CommonCall(api, header);
    return result;
  },
  getAllUserExam: async () => {
    const header = {
      method: 'GET',
    };
    const api = `${API_ENDPOINT}/api/user/exam-all`;
    const result = await CommonCall(api, header);
    return result;
  },
  userStartExam: async obj => {
    const header = {
      method: 'POST',
      body: JSON.stringify(obj),
    };
    const api = `${API_ENDPOINT}/api/public/exam-start`;
    const result = await CommonCall(api, header);
    return result;
  },
  userSubmitExam: async obj => {
    const header = {
      method: 'PUT',
      body: JSON.stringify(obj),
    };
    const api = `${API_ENDPOINT}/api/public/exam-submit`;
    const result = await CommonCall(api, header);
    return result;
  },
  uploadImage: async obj => {
    const cookies = new Cookies();
    const account = cookies.get('account');
    const formData = new FormData();
    formData.append('file', obj);

    const header = {
      method: 'POST',
      body: formData,
      // headers: {
      //   // 'Content-Type': 'multipart/form-data',
      //   // Authorization: `Bearer ${account.accessToken}`,
      // },
    };

    const api = `${API_ENDPOINT}/api/public/image-upload`;
    const response = await fetch(api, header);
    const result = await response.json();
    return `${API_ENDPOINT}${result?.dto?.path}`;
  },
  uploadExcel: async obj => {
    const cookies = new Cookies();
    const account = cookies.get('account');
    const formData = new FormData();
    formData.append('file', obj);

    const header = {
      method: 'POST',
      body: formData,
      headers: {
        // 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${account.accessToken}`,
      },
    };

    const api = `${API_ENDPOINT}/api/admin/import-excel`;
    const response = await fetch(api, header);
    const result = await response.json();
    return result;
  },
  createNoti: async obj => {
    const header = {
      method: 'POST',
      body: JSON.stringify(obj),
    };
    const api = `${API_ENDPOINT}/api/admin/notify-create`;
    const result = await CommonCall(api, header);
    return result;
  },
  listNotifications: async () => {
    const header = {
      method: 'GET',
    };
    const api = `${API_ENDPOINT}/api/public/notify-all`;
    const result = await CommonCall(api, header);
    return result;
  },
  updateNotification: async obj => {
    const header = {
      method: 'PUT',
      body: JSON.stringify(obj),
    };
    const api = `${API_ENDPOINT}/api/admin/notify-update`;
    const result = await CommonCall(api, header);
    return result;
  },
  deleteNoti: async id => {
    const header = {
      method: 'DELETE',
    };
    const api = `${API_ENDPOINT}/api/admin/notify-delete?id=${id}`;
    const result = await CommonCall(api, header);
    return result;
  },
  changePassword: async obj => {
    const header = {
      method: 'PUT',
      body: JSON.stringify(obj),
    };
    const api = `${API_ENDPOINT}/api/user/user-changing-password`;
    const result = await CommonCall(api, header);
    return result;
  },
  getExamHistory: async ({page, size}) => {
    const header = {
      method: 'GET',
    };
    const api = `${API_ENDPOINT}/api/user/exams-history?page=${page}&size=${size}`;
    const result = await CommonCall(api, header);
    return result;
  },
  adminGetExamHistory: async ({page, size}) => {
    const header = {
      method: 'GET',
    };
    const api = `${API_ENDPOINT}/api/admin/exams?page=${page}&size=${size}`;
    const result = await CommonCall(api, header);
    return result;
  },
  adminGetDetailTestHistory: async ({page, size, examId}) => {
    const header = {
      method: 'GET',
    };
    const api = `${API_ENDPOINT}/api/admin/exam-history-users?examId=${examId}&page=${page}&size=${size}`;
    const result = await CommonCall(api, header);
    return result;
  },
  getAllUsers: async ({page, size}) => {
    const header = {
      method: 'GET',
    };
    const api = `${API_ENDPOINT}/api/admin/all-user?page=${page}&size=${size}`;
    const result = await CommonCall(api, header);
    return result;
  },
  downloadExamExcel: async ({examId}) => {
    const result = await downFile(
      `${API_ENDPOINT}/api/admin/get-exam-excel-file?examId=${examId}`,
      'GET',
      `Exam${examId}.xlsx`,
    );
    return result;
  },
};

const downFile = async (api, method, fileName) => {
  const cookies = new Cookies();
  const account = cookies.get('account');

  try {
    const result = await fetch(api, {
      method: method,
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
      },
    });
    if (result.status === 200) {
      const blob = await result.blob();
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      // Append to html link element page
      document.body.appendChild(link);
      // Start download
      link.click();
      // Clean up and remove the link
      link.parentNode.removeChild(link);
      return;
    }
    return {message: 'Có lỗi xảy ra, vui lòng thử lại sau'};
  } catch (e) {
    return {message: 'Có lỗi xảy ra, vui lòng thử lại sau'};
  }
};

export {FetchApi};
