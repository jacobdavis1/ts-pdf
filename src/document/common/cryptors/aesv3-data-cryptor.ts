import { int32ArrayToBytes } from "../../../common/utils";
import { DataCryptor, AES_INIT_VALUE, aes } from "../crypto";

export class AESV3DataCryptor implements DataCryptor {
  protected _n: number;
  protected _key: Uint8Array;

  constructor(key: Uint8Array) {
    if (!key) {      
      throw new Error("Empty key");
    }
    if (key.length !== 32) {
      throw new Error(`Invalid key length: ${key.length} (shall be 16)`);
    }

    this._n = key.length;
    this._key = key;
  }

  encrypt(data: Uint8Array, id: number, generation: number): Uint8Array { 
    return this.run(data, id, generation, new Uint8Array(AES_INIT_VALUE));
  }

  decrypt(data: Uint8Array, id: number, generation: number): Uint8Array {
    return this.run(data, id, generation);
  }
  
  protected run(data: Uint8Array, id: number, generation: number, iv?: Uint8Array): Uint8Array {   
    /*
    1. Use the 32-byte file encryption key for the AES-256 symmetric key algorithm, 
    along with the string or stream data to be encrypted. Use the AES algorithm 
    in Cipher Block Chaining (CBC) mode, which requires an initialization vector. 
    The block size parameter is set to 16 bytes, and the initialization vector 
    is a 16-byte random number that is stored as the first 16 bytes of the encrypted stream or string
    */
    iv ??= data.slice(0, 16);
    const encrypted = int32ArrayToBytes(aes(data, this._key, iv).words);    
    return encrypted;
  }
}