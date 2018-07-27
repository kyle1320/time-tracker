export default function uid() {
  return (Math.random().toString(36) + "000000000").substr(2, 9);
}