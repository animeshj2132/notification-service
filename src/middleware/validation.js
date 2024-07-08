export function isValid(value) {
  if (typeof value === 'undefined') return false;
  if (typeof value === 'string' && value.trim().length === 0) return false;
  if (typeof value === 'number' && value.trim().length === 0) return false;
  return true;
}

export function isValidUUID(uuid) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

export function isValidPassword(password) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
  return re.test(password);
}

export function isValidEmail(mail) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(mail);
}

export function isValidUsername(name) {
  const re = /^[a-zA-Z]+( [a-zA-Z]+)*$/;
  return re.test(name);
}
