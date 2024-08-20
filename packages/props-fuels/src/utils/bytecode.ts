import pako from "pako";

export const decompressBytecode = (bytecode: string): Uint8Array => {
  const binaryString = atob(bytecode);
  return pako.inflate(Uint8Array.from(binaryString, (c) => c.charCodeAt(0)));
};
