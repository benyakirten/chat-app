const ENCRYPTION_ALGORITHM = 'RSA-OAEP'

const keyGenParams: RsaHashedKeyGenParams = {
  name: ENCRYPTION_ALGORITHM,
  modulusLength: 2048,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537 in little-endian format
  hash: { name: 'SHA-256' },
}

export function generateKeys(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(keyGenParams, true, ['encrypt', 'decrypt'])
}

/**
 * Encrypt a message using a public key
 * and transfer it to base64 so it can be transmitted over JSON.
 */
export async function encrypt(publicKey: CryptoKey, message: string): Promise<string> {
  // Encode a string into an array buffer
  const encoder = new TextEncoder()
  const encoded = encoder.encode(message)

  // Encrypt the string - returns an array buffer
  const encrypted = await crypto.subtle.encrypt(ENCRYPTION_ALGORITHM, publicKey, encoded)

  // Take the array buffer and encode it as base64 so it can be transmitted over json.
  // TODO: Figure out if we can do this more efficiently using protocol buffers.
  const base64 = sidecodeArrayBufferAsBase64(encrypted)
  return base64
}

export async function decrypt(privateKey: CryptoKey, encryptedMessage: string): Promise<string> {
  const buffer = sidecodeBase64ToArrayBuffer(encryptedMessage)
  const decrypted = await crypto.subtle.decrypt(ENCRYPTION_ALGORITHM, privateKey, buffer)

  const decoder = new TextDecoder()
  return decoder.decode(decrypted)
}

export function sidecodeArrayBufferAsBase64(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer)
  const charCodes = String.fromCharCode(...uint8Array)
  return btoa(charCodes)
}

export function sidecodeBase64ToArrayBuffer(base64: string): ArrayBuffer {
  const decoded = atob(base64)
  const uint8Array = new Uint8Array(decoded.length)
  for (let i = 0; i < decoded.length; i++) {
    uint8Array[i] = decoded.charCodeAt(i)
  }

  const arrayBuffer = uint8Array.buffer
  return arrayBuffer
}

/**
 * Create a base64-encoded string of a CryptoKey exported to JSON.
 * This is so it can be stored as a string in the database and not have to create a separate table for it.
 * The tradeoff is that it will require additional computing resources to encode/decode.
 *
 * TODO: Consider using a separate table for this.
 */
export async function exportKeyToBase64(key: CryptoKey): Promise<string> {
  const exported = crypto.subtle.exportKey('jwk', key)
  const stringified = JSON.stringify(exported)
  return btoa(stringified)
}

/**
 * Reverse process of the above function.
 */
export async function importKeyFromBase64(base64: string, type: 'public' | 'private'): Promise<CryptoKey> {
  const decoded = atob(base64)
  const decodedInJson = JSON.parse(decoded)
  const importedKey = await crypto.subtle.importKey('jwk', decodedInJson, keyGenParams, true, [
    type === 'private' ? 'decrypt' : 'encrypt',
  ])
  return importedKey
}
