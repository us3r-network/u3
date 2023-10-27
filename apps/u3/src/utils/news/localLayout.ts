const CONTENTS_KEY = 'contents-layout';
const EVENTS_KEY = 'events-layout';

export enum Layout {
  LIST = 'LIST',
  GRID = 'GRID',
}
export function getContentsLayoutFromLocal(): Layout {
  const curr = localStorage.getItem(CONTENTS_KEY) || Layout.LIST;

  return curr as Layout;
}

export function setContentsLayoutToLocal(layout: Layout) {
  localStorage.setItem(CONTENTS_KEY, layout.toString());
}

export function getEventsLayoutFromLocal(): Layout {
  const curr = localStorage.getItem(EVENTS_KEY) || Layout.LIST;

  return curr as Layout;
}

export function setEventsLayoutToLocal(layout: Layout) {
  localStorage.setItem(EVENTS_KEY, layout.toString());
}
