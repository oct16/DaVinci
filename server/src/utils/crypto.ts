import crypto from 'crypto'
const defaultEncryptKey = 'miniCooper'
export const aesEncrypt = (data: string, key: string = defaultEncryptKey) => {
    const cipher = crypto.createCipher('aes192', key)
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
}

export const aesDecrypt = (encrypted: string, key: string = defaultEncryptKey) => {
    const decipher = crypto.createDecipher('aes192', key)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}
