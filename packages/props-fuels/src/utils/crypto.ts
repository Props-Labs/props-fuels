export function getRandomBytes(length:number) {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return array;
  } else {
    throw new Error("Crypto API not available");
  }
}
