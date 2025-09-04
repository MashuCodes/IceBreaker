export const categories = ["Funny", "Deep", "RapidFire"];

export function spinWheel() {
  const randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
}