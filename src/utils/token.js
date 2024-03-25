export default function token() {
  const rand = function () {
    return Math.random().toString(36);
  };

  const randStr = function () {
    return rand() + rand();
  };

  return randStr();
}
