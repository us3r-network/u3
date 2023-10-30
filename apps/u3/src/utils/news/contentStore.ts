const KEY = 'seeOrHidden';
export function addOrRemoveFromLocal(id: number | string) {
  const exits = localStorage.getItem(KEY) || '{}';
  const exitsData = JSON.parse(exits);
  if (exitsData[id]) {
    delete exitsData[id];
  } else {
    exitsData[id] = id;
  }
  localStorage.setItem(KEY, JSON.stringify(exitsData));
  return exitsData;
}

export function getLocalData() {
  const exits = localStorage.getItem(KEY) || '{}';
  const exitsData = JSON.parse(exits);
  return exitsData;
}
