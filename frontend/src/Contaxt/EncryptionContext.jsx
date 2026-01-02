import React, { createContext, useContext } from 'react';
import CryptoJS from 'crypto-js';
import { sanitizeInput, SECREAT_KEY } from '../config';

const EncryptionDecryption = createContext();


export const useEncryptionDecryptionContext = ()=> useContext(EncryptionDecryption);


export const EncryptionDecryptionProvider = ({children})=>{
    // Encryption function
	const encrypt = (data) => {
		// Encrypt the data using AES and the SECREAT_KEY
		const ciphertext = CryptoJS.AES.encrypt(data, SECREAT_KEY).toString();

		// Base64 encode and replace non-alphanumeric characters
		const base64Cipher = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(ciphertext));

		// Remove non-alphanumeric characters, only keep letters and digits
		const sanitizedCipher = base64Cipher.replace(/[^A-Za-z0-9]/g, '');

		// Return sanitized ciphertext
		return sanitizedCipher;
	};

	// Decryption function
	const decrypt = (encryptedData) => {
		// Reintroduce base64 encoding (if you encoded it in base64)
		const decodedCiphertext = CryptoJS.enc.Base64.parse(encryptedData).toString(CryptoJS.enc.Utf8);

		// Decrypt the ciphertext using AES and the same SECREAT_KEY
		const bytes = CryptoJS.AES.decrypt(decodedCiphertext, SECREAT_KEY);
		const originalData = bytes.toString(CryptoJS.enc.Utf8);

		return originalData;
	};
	const encryptWithKey = (data,key)=>{
		// Encrypt the data using AES and the SECREAT_KEY
		const ciphertext = CryptoJS.AES.encrypt(data, key).toString();

		// Base64 encode and replace non-alphanumeric characters
		const base64Cipher = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(ciphertext));

		// Remove non-alphanumeric characters, only keep letters and digits
		const sanitizedCipher = base64Cipher.replace(/[^A-Za-z0-9]/g, '');

		// Return sanitized ciphertext
		return sanitizedCipher;
	}
	const decryptWithKey = (encryptedData,key)=>{
		// Reintroduce base64 encoding (if you encoded it in base64)
		const decodedCiphertext = CryptoJS.enc.Base64.parse(encryptedData).toString(CryptoJS.enc.Utf8);

		// Decrypt the ciphertext using AES and the same SECREAT_KEY
		const bytes = CryptoJS.AES.decrypt(decodedCiphertext, key);
		const originalData = bytes.toString(CryptoJS.enc.Utf8);

		return originalData;
	}
    return (
        <EncryptionDecryption.Provider value={{
            encrypt,
            decrypt,
			encryptWithKey,
			decryptWithKey
        }}>
            {children}
        </EncryptionDecryption.Provider>
    )
}