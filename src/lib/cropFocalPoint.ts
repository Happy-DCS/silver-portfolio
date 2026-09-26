import type { CropArea } from "@/lib/getWorks";

export function centerFocalPoint(area: CropArea): { x: number; y: number } {
  return { x: area.x + area.width / 2, y: area.y + area.height / 2 };
}
