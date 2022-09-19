export function isEmptyObj(obj: any) {
  for (var x in obj) {
    return false;
  }
  return true;
}
