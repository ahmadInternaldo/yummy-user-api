export const successConstant = {
  errorCode: 0,
  message: 'Success',
};

export const unauthorizedErrorConstant = {
  errorCode: 4001,
  message: 'Unauthorized',
};

export const invalidUser = {
  errorCode: 4002,
  message: 'Invalid username or password',
};

export const kickOutAccount = {
  errorCode: 4003,
  message: `Please Login Again`,
};

export const sessionTokenExpiredErrorConstant = {
  errorCode: 4004,
  message: `Session token expired`,
};

export const suspended = (suspendedTime) => {
  return {
    errorCode: 4005,
    message: `You are suspended until ${new Date(
      suspendedTime,
    ).toLocaleDateString('en-US')} at ${new Date(
      suspendedTime,
    ).toLocaleTimeString('en-US')}`,
  };
};

export const limitOccurred = {
  errorCode: 4006,
  message: 'The loan has exceeded the limit',
};

export const notFoundException = {
  errorCode: 4007,
  message: 'User not found'
}

export const alreadyExisted = {
  errorCode: 4008,
  message: 'Username already existed'
}

export const AdminAccess = {
  errorCode: 4009,
  message: 'Only Admin can create userAdmin'
}