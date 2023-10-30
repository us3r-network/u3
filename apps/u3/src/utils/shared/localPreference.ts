const KEY = 'preference';
// whatever the value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addLocalPreference(exitsData: { [key: string]: any }) {
  localStorage.setItem(KEY, JSON.stringify(exitsData));
  return exitsData;
}

export function getLocalPreference() {
  const exits = localStorage.getItem(KEY) || '{}';
  const exitsData = JSON.parse(exits);
  return exitsData;
}
