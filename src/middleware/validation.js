/* eslint-disable func-names */
export const isValid = function (value) {
  if (typeof value === 'undefined') return false;
  if (typeof value === 'string' && value.trim().length === 0) return false;
  if (typeof value === 'number' && value.trim().length === 0) return false;
  return true;
};

export const isValidUUID = (uuid) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

export const isValidPassword = function checkPassword(password) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
  return re.test(password);
};

export const isValidEmail = function checkMail(mail) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(mail);
};

export const isValidUsername = function username(name) {
  const re = /^[a-zA-Z]+( [a-zA-Z]+)*$/;
  return re.test(name);
};
