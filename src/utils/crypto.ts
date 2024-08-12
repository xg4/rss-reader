import CryptoJS from "crypto-js";

export function md5(input: string) {
  return CryptoJS.MD5(input).toString();
}

export function encodeBase64(input: string) {
  return CryptoJS.enc.Utf8.parse(input).toString(CryptoJS.enc.Base64url);
}

export function decodeBase64(input: string) {
  return CryptoJS.enc.Base64url.parse(input).toString(CryptoJS.enc.Utf8);
}
