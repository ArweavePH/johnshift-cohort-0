import { AppInfo, PermissionType } from 'arconnect';

export const AOS_PROCESS_ID = 'CNaZCk51Ub8KI2SHOgPporox3mVy-Ix3-QwP-Wu2s7M';

export const AVATAR_PREFIX =
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=';

export const MODAL_IDS = {
  SELECT_CATEGORY: 'select-category-modal',
  SHOW_ANSWER: 'show-answer',
} as const;

export const WALLET_PERMISSIONS: PermissionType[] = [
  'ACCESS_ADDRESS',
  'ACCESS_PUBLIC_KEY',
  'DISPATCH',
  'SIGNATURE',
  'SIGN_TRANSACTION',
];

export const APP_INFO: AppInfo = {
  name: 'Arweave Wallet Kit',
  logo: 'https://ctrjmfuctajkmy7rpk53hbzjq2eyzphuseuyifd5l3kemke5aadq.arweave.net/FOKWFoKYEqZj8Xq7s4cphomMvPSRKYQUfV7URiidAAc',
};

export const CATEGORIES = {
  ANIMALS: 'Guess the animal',
  PH: 'PH Trivias',
} as const;
