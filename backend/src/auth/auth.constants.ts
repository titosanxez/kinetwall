export const jwtConstants = {
  secret: crypto.getRandomValues(new Int8Array(64)).toString(),
}