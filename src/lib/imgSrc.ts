export function imgSrc(img: string): string {
  if (!img)               return "/images/placeholder.png";
  if (img.startsWith("http")) return img;
  return `/images/${img}`;
}
