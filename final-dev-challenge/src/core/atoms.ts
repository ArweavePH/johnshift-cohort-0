import { atom } from 'jotai';

// const _gameIdAtom = atom(localStorage.getItem(LS_KEYS.GAME_ID) ?? '');
// export const gameIdAtom = atom(
//   (get) => get(_gameIdAtom),
//   (_, set, newValue: string) => {
//     set(_gameIdAtom, newValue);
//     localStorage.setItem('gameId', newValue);
//   },
// );

export const previousPathAtom = atom<string | null>(null);
