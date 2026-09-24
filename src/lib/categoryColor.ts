const FALLBACK_ACCENT = "#8d9198";
const FALLBACK_GRADIENT = "linear-gradient(135deg,#8d9198,#e6e8ec)";

// DJB2 string hash — small input changes cause large, unpredictable output
// changes (avalanche effect), so similarly-spelled categories don't end up
// with similar hues the way a naive char-sum hash would.
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

function hueFromCategory(category: string): number {
  return djb2Hash(category) % 360;
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n: number) => lNorm - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

export function categoryAccent(category: string | undefined): string {
  if (!category) return FALLBACK_ACCENT;
  return hslToHex(hueFromCategory(category), 60, 42);
}

export function categoryGradient(category: string | undefined): string {
  if (!category) return FALLBACK_GRADIENT;
  const hue = hueFromCategory(category);
  const dark = hslToHex(hue, 60, 42);
  const light = hslToHex(hue, 55, 78);
  return `linear-gradient(135deg, ${dark}, ${light})`;
}
