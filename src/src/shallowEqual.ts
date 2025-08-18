export function shallowEqual<T extends Record<string, any> | any[]>(objA: T, objB: T): boolean {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA) as (keyof T)[];
  const keysB = Object.keys(objB) as (keyof T)[];

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!(key in objB)) {
      return false;
    }
    if (!Object.is(objA[key], objB[key])) {
      return false;
    }
  }

  return true;
}
