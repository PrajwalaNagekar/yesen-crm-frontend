// Deterministic avatar color per name, so the same person always gets the
// same color across the app without storing it anywhere.
const PALETTE = [
  'from-indigo-500 to-violet-400',
  'from-blue-500 to-cyan-400',
  'from-teal-500 to-emerald-400',
  'from-violet-500 to-fuchsia-400',
  'from-sky-500 to-blue-400',
  'from-rose-500 to-orange-400',
];

export function getAvatarGradient(seed = '') {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
