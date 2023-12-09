const ENCRYPTION_ALGORITHM = 'RSA-OAEP'

const keyGenParams: RsaHashedKeyGenParams = {
  name: ENCRYPTION_ALGORITHM,
  modulusLength: 2048,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537 in little-endian format
  hash: { name: 'SHA-256' },
}

/**
 * Generate a public and private key using the RSA-OAEP algorith.
 */
export function generateKeys(): Promise<{ publicKey: CryptoKey; privateKey: CryptoKey }> {
  return crypto.subtle.generateKey(keyGenParams, true, ['encrypt', 'decrypt'])
}

/**
 * Encrypt a message using a public key and encodes it as base64.
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

/**
 * Decodes  message from base64 then decrypts it using a private key.
 */
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
