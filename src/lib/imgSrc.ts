export function imgSrc(img: string): string {
  if (!img)                   return "";
  if (img.startsWith("http")) return img;
  return `/images/${img}`;
}
