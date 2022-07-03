import moment from 'moment';

const apiId = 'hHEBN4uWiLGeyB6thnGs';
const gatewayURL = 'https://api.ssdemr.com';
export const Login = async (UserName, Password) => {
  const bodyData = { email: UserName, password: Password };
  const response = await fetch(`${gatewayURL}/v1/admin/signin`, {
    method: 'post',
    body: JSON.stringify(bodyData),
    headers: {
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const Register = async (values) => {
  const bodyData = {
    email: values?.email,
    username: values?.username,
    password: values?.password,
    firstName: values?.firstName,
    lastName: values?.lastName,
    phoneNumber: values?.phoneNumber
  };
  const response = await fetch(`${gatewayURL}/v1/users/signup`, {
    method: 'post',
    body: JSON.stringify(bodyData),
    headers: {
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getSignUpFields = async (project) => {
  const response = await fetch(`${gatewayURL}/v1/users/project-signup-form/${project}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const updateSignupForm = async (values) => {
  const bodyData = {
    project_name: 'EMR',
    signup_fields: values
  };
  const response = await fetch(`${gatewayURL}/v1/users/project-signup-form`, {
    method: 'put',
    body: JSON.stringify(bodyData),
    headers: {
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const forgotPassword = async (email) => {
  const bodyData = {
    email
  };
  const response = await fetch(`${gatewayURL}/v1/users/forgot-password`, {
    method: 'post',
    body: JSON.stringify(bodyData),
    headers: {
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const resetPassword = async (token, password) => {
  const bodyData = {
    token,
    password
  };
  const response = await fetch(`${gatewayURL}/v1/users/reset-password`, {
    method: 'post',
    body: JSON.stringify(bodyData),
    headers: {
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const createPassword = async (token, password) => {
  const bodyData = {
    token,
    password
  };
  const response = await fetch(`${gatewayURL}/v1/users/set-user-password`, {
    method: 'post',
    body: JSON.stringify(bodyData),
    headers: {
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const CreateUser = async (values) => {
  const bodyData = {
    email: values?.email,
    username: values?.username,
    firstName: values?.firstName,
    lastName: values?.lastName,
    phoneNumber: values?.phoneNumber,
    isActive: values?.isActive === 1,
    isAdmin: values?.role === 1
  };
  const response = await fetch(`${gatewayURL}/v1/admin/user`, {
    method: 'post',
    body: JSON.stringify(bodyData),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const EditUser = async (values, id) => {
  const bodyData = {
    email: values?.email,
    username: values?.username,
    firstName: values?.firstName,
    lastName: values?.lastName,
    phoneNumber: values?.phoneNumber,
    isActive: values?.isActive === 1,
    isAdmin: values?.role === 1
  };
  console.log(values);
  const response = await fetch(`${gatewayURL}/v1/admin/user/${id}`, {
    method: 'put',
    body: JSON.stringify(bodyData),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getAdminUsers = async () => {
  const response = await fetch(`${gatewayURL}/v1/admin/user`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const deleteUser = async (id) => {
  const response = await fetch(`${gatewayURL}/v1/admin/user/soft-delete/${id}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getUserDetail = async (id) => {
  const response = await fetch(`${gatewayURL}/v1/admin/user/${id}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const Logout = async () => {
  const bodyData = { user_id: localStorage.getItem('id') };
  const response = await fetch(`${gatewayURL}/v1/users/logout`, {
    method: 'post',
    body: JSON.stringify(bodyData),
    headers: {
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getLogs = async (start, end, values) => {
  const response = await fetch(
    `${gatewayURL}/v1/logs?startDate=${start?.length ? start : ''}&endDate=${
      end?.length ? end : ''
    }&userId=${values?.assign_to || ''}&search=${values?.type_filter || ''}`,
    {
      method: 'get',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        'Content-Type': 'application/json',
        CLIENT_ID: apiId
      }
    }
  );
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const AddPatient = async (values) => {
  const bodyData = {
    address: values?.address,
    dateOfBirth: values?.dateOfBirth ? moment(values?.dateOfBirth).format('MM-DD-YYYY') : '',
    firstName: values?.firstName,
    lastName: values?.lastName,
    phoneNumber: values?.phoneNumber,
    middleName: values?.middleName,
    patientId: values?.patientId
  };
  const response = await fetch(`${gatewayURL}/v1/patient`, {
    method: 'post',
    body: JSON.stringify(bodyData),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const UpdatePatient = async (values) => {
  const bodyData = {
    address: values?.address,
    dateOfBirth: values?.dateOfBirth ? moment(values?.dateOfBirth).format('MM-DD-YYYY') : '',
    firstName: values?.firstName,
    lastName: values?.lastName,
    phoneNumber: values?.phoneNumber,
    middleName: values?.middleName,
    patientId: values?.patientId
  };
  const response = await fetch(`${gatewayURL}/v1/patient/${values?.patientId}`, {
    method: 'put',
    body: JSON.stringify(bodyData),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getAdminPatients = async () => {
  const response = await fetch(`${gatewayURL}/v1/patient`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};

export const getAllFolder = async () => {
  const response = await fetch(`${gatewayURL}/v1/files/getAllFolder`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getFileByFolderId = async (id) => {
  const response = await fetch(`${gatewayURL}/v1/files/filesInFolder?folderId=${id}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getActiveUsers = async () => {
  const response = await fetch(`${gatewayURL}/v1/dashboard/activeUser`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getTotalProjects = async () => {
  const response = await fetch(`${gatewayURL}/v1/dashboard/totalProjects`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getTotalUsers = async () => {
  const response = await fetch(`${gatewayURL}/v1/dashboard/totalUser`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getUsersByProject = async () => {
  const response = await fetch(`${gatewayURL}/v1/dashboard/userByProject`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const uploadCsv = async (csv) => {
  const bodyData = { data: csv.split('base64,')[1] };
  const response = await fetch(`${gatewayURL}/v1/dashboard/uploadCsv`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    },
    body: JSON.stringify(bodyData)
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getCategories = async () => {
  const response = await fetch(`${gatewayURL}/v1/categories`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const addCategory = async (category) => {
  const response = await fetch(`${gatewayURL}/v1/categories`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    },
    body: JSON.stringify({ name: category })
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const editCategory = async (category, id) => {
  const response = await fetch(`${gatewayURL}/v1/categories/${id}`, {
    method: 'put',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    },
    body: JSON.stringify({ name: category })
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const deleteCategory = async (id) => {
  const response = await fetch(`${gatewayURL}/v1/categories/${id}`, {
    method: 'delete',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const mergeCategory = async (id, target) => {
  const response = await fetch(`${gatewayURL}/v1/categories/merge`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    },
    body: JSON.stringify({ categoriesToBeMerged: id, targetCategory: target })
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getLabels = async () => {
  const response = await fetch(`${gatewayURL}/v1/labels`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const mergeLabels = async (id, target) => {
  const response = await fetch(`${gatewayURL}/v1/labels/merge`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    },
    body: JSON.stringify({ labelsToBeMerged: id, targetLabel: target })
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const deleteLabels = async (id) => {
  const response = await fetch(`${gatewayURL}/v1/labels/${id}`, {
    method: 'delete',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const addLabel = async (name, id) => {
  const response = await fetch(`${gatewayURL}/v1/labels`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    },
    body: JSON.stringify({ name, categoryId: id })
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const editLabel = async (name, id, id1) => {
  const response = await fetch(`${gatewayURL}/v1/labels/${id1}`, {
    method: 'put',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    },
    body: JSON.stringify({ name, categoryId: id })
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const updateFile = async (bodyData) => {
  const response = await fetch(`${gatewayURL}/v1/files/1VnasLTD3hSoaHxf-2UY9F94oYTXqOhDq`, {
    method: 'put',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    },
    body: JSON.stringify(bodyData)
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getLabelsByCategory = async (id) => {
  const response = await fetch(`${gatewayURL}/v1/labels/categories?categories=${id}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const approveUser = async (id, action) => {
  const response = await fetch(
    `${gatewayURL}/v1/admin/manual-account-approval/${id}?action=${action}`,
    {
      method: 'get',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        'Content-Type': 'application/json',
        CLIENT_ID: apiId
      }
    }
  );
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getUserProfile = async () => {
  const response = await fetch(`${gatewayURL}/v1/users/profile`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const updateUserProfile = async (values) => {
  const bodyData = {
    firstName: values.firstname,
    lastName: values.lastname,
    phonenumber: values.phone
  };
  const response = await fetch(`${gatewayURL}/v1/users/profile`, {
    method: 'put',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    },
    body: JSON.stringify(bodyData)
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const adminResetPassword = async (email) => {
  const bodyData = {
    email
  };
  const response = await fetch(`${gatewayURL}/v1/admin/user/reset-password`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    },
    body: JSON.stringify(bodyData)
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const ImagesFilter = async (queryParams) => {
  const response = await fetch(`${gatewayURL}/v1/files/filters?${queryParams || ''}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const deletedUsers = async () => {
  const response = await fetch(`${gatewayURL}/v1/admin/user/soft-deleted-list`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const permanentlyDelete = async (id) => {
  const response = await fetch(`${gatewayURL}/v1/admin/user/delete/${id}`, {
    method: 'delete',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const restoreUser = async (id) => {
  const response = await fetch(`${gatewayURL}/v1/admin/user/restore-soft-deleted/${id}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const deleteFiles = async (id) => {
  const bodyData = { file_ids: id };
  const response = await fetch(`${gatewayURL}/v1/files/deleteFile`, {
    method: 'delete',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    },
    body: JSON.stringify(bodyData)
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getIndexLesions = async (id) => {
  const response = await fetch(`${gatewayURL}/v1/patient/indexLesion/${id}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const updatePermission = async (bodyData, id) => {
  const response = await fetch(`${gatewayURL}/v1/admin/permissions/user/${id}`, {
    method: 'put',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    },
    body: JSON.stringify(bodyData)
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const RegisterPatient = async (values) => {
  const response = await fetch(`${gatewayURL}/v2/patient`, {
    method: 'post',
    body: JSON.stringify(values),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const UpdatePatients = async (values, patientId) => {
  const response = await fetch(`${gatewayURL}/v2/patient/${patientId}`, {
    method: 'put',
    body: JSON.stringify(values),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const AddEmployer = async (values) => {
  const response = await fetch(`${gatewayURL}/v2/employer/add`, {
    method: 'post',
    body: JSON.stringify(values),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const AddInsurance = async (values) => {
  const response = await fetch(`${gatewayURL}/v2/insurance/add`, {
    method: 'post',
    body: JSON.stringify(values),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getRegistredPatients = async () => {
  const response = await fetch(`${gatewayURL}/v2/patient`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getPatient = async (id) => {
  const response = await fetch(`${gatewayURL}/v2/patient/one/${id}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();
  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const AddPharmacy = async (values) => {
  const response = await fetch(`${gatewayURL}/v2/pharmacy/add`, {
    method: 'post',
    body: JSON.stringify(values),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const DeletePharmacy = async (id) => {
  const response = await fetch(`${gatewayURL}/v2/pharmacy/${id}`, {
    method: 'delete',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const PatientsDelete = async (id) => {
  const response = await fetch(`${gatewayURL}/v2/patient/${id}`, {
    method: 'delete',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const getInsurance = async (id) => {
  const response = await fetch(`${gatewayURL}/v2/insurance/${id}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const GetEmployer = async (id) => {
  const response = await fetch(`${gatewayURL}/v2/employer/${id}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();
  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const GetPharmacy = async (id) => {
  const response = await fetch(`${gatewayURL}/v2/pharmacy/${id}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const UpdateInsurance = async (values, id) => {
  const response = await fetch(`${gatewayURL}/v2/insurance/update/${id}`, {
    method: 'put',
    body: JSON.stringify(values),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();
  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const DeleteEmployer = async (id) => {
  const response = await fetch(`${gatewayURL}/v2/employer/${id}`, {
    method: 'delete',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const AddAppointment = async (values) => {
  const response = await fetch(`${gatewayURL}/v2/patient_appointment`, {
    method: 'post',
    body: JSON.stringify(values),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const UpdateAppointment = async (values, id) => {
  const response = await fetch(`${gatewayURL}/v2/patient_appointment/${id}`, {
    method: 'PUT',
    body: JSON.stringify(values),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const GetProviders = async () => {
  const response = await fetch(`${gatewayURL}/v2/provider`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const GetLocations = async () => {
  const response = await fetch(`${gatewayURL}/v2/location`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const GetAppointmentTypes = async (id) => {
  const response = await fetch(`${gatewayURL}/v2/appointment_type`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const GetAppointmentLengths = async (id) => {
  const response = await fetch(`${gatewayURL}/v2/appointment_length`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const GetPatientAppointment = async () => {
  const response = await fetch(`${gatewayURL}/v2/patient_appointment`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
export const GetAllReferrer = async () => {
  const response = await fetch(`${gatewayURL}/v2/referrer`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
      CLIENT_ID: apiId
    }
  });
  const data = await response.json();

  if (response.status >= 400) {
    console.error(response.status);
  }
  return data;
};
