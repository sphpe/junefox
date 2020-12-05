import { sessionPrefix } from "../config"

export var sid = null;

export function getSid() {
  return sid;
}

export function getStorageSid() {
  return localStorage.getItem(sessionPrefix+"sid") || "";
}

export function setSid(newSid) {
  sid = newSid;
  localStorage.setItem(sessionPrefix+"sid", sid);
}

export function clearSid() {
  sid = null
  localStorage.removeItem(sessionPrefix+"sid");
}

export function setItem(key,value) {
  localStorage.setItem(sessionPrefix+key, value);
}

export function getItem(key) {
  return localStorage.getItem(sessionPrefix+key) 
}

export function removeItem(key) {
  localStorage.removeItem(sessionPrefix+key);
}