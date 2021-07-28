
import { Buffer } from 'buffer'
import cbor from 'cbor'
import CID from 'cids'
import multihashing from 'multihashing-async'
import * as ethutil from 'ethereumjs-util'
import varint from 'varint'
import { trim } from 'mytoolkit'
import base32Decode from 'base32-decode'
import BN from 'bn.js'
import blake from 'blakejs'

export async function getT1SignedMsg(msg, sk) {
    let sig = await getT1Sig(msg, sk)
    return {
      Message: msg,
      Signature: {
        Type: 1,
        Data: sig
      }
    }
  }

export async function getT1Sig(msg, sk) {
    let mcid = await getCid(msg)
    if (typeof sk === 'string') {
        sk = Buffer.from(sk, 'base64');
    }
    if (typeof mcid === 'string') {
        mcid = Buffer.from(mcid, 'base64');
    }
    let sig = t1Sign(mcid, sk)
    return sig
}

export async function getCid(msg) {
    let b = serializeMsg(msg)
    b = Buffer.from(b, 'base64')
    const hash = await multihashing(b, 45600, 32)
    const cid = new CID(1, 'dag-cbor', hash)
    return cid.buffer.toString('base64')
}

export function t1Sign(msgBuff, priKey) {
    let msgHash = blake2b(msgBuff, 32);
    let sig = ethutil.ecsign(Buffer.from(msgHash), Buffer.from(priKey));
    let tail = Number(sig.v) === 28 ? "01" : "00"
    let sign = sig.r.toString('hex') + sig.s.toString('hex') + tail
    return Buffer.from(sign, 'hex').toString('base64')
}

export function serializeMsg(msg) {
    let versionBuf, toBuf, fromBuf, nonceBuf, valueBuf, gasPremiumBuf, gasLimitBuf, methodBuf, paramsBuf, gasFeeCapBuf
    versionBuf = cbor.encode(msg.Version)
    toBuf = cborAddress(msg.To)
    fromBuf = cborAddress(msg.From)
    nonceBuf = cbor.encode(msg.Nonce)
    valueBuf = cbor.encode(getBigIntBuffer(msg.Value))
    gasPremiumBuf = cbor.encode(getBigIntBuffer(msg.GasPremium))
    gasFeeCapBuf = cbor.encode(getBigIntBuffer(msg.GasFeeCap))
    gasLimitBuf = cbor.encode(msg.GasLimit)
    methodBuf = cbor.encode(msg.Method)
    paramsBuf = cbor.encode(Buffer.from(msg.Params, "base64"))
    return Buffer.from([138, ...versionBuf, ...toBuf, ...fromBuf, ...nonceBuf, ...valueBuf, ...gasLimitBuf, ...gasFeeCapBuf, ...gasPremiumBuf, ...methodBuf, ...paramsBuf]).toString('base64')
}

export function blake2b(arr, len) {
    return blake.blake2b(arr, null, len)
}

function cborAddress(address) {
    let addr = trim(address)
    if (Number(address[1]) === 0) {
      let payload = [Number(address[1])]
      let intbytes = varint.encode(Number(addr.substr(2)))
      payload = [...payload, ...intbytes]
      return cbor.encode(Buffer.from(payload))
    } else {
      return cbor.encode(getAddressBuff(addr))
    }
}
export function getAddressBuff(address) {
    let protocol = Number(address[1]);
    address = address.substring(2, address.length).toUpperCase()
    let addressBuff = new Uint8Array(base32Decode(address, 'RFC4648'))
    let aa = Array.from(addressBuff)
    aa = aa.slice(0, aa.length - 4)
    aa.unshift(protocol)
    return Uint8Array.from(aa)
}

export function getBigIntBuffer(gasprice) {
    if (gasprice === "0") {
      return Buffer.from("");
    }
    const gaspriceBigInt = new BN(gasprice, 10);
    const gaspriceBuffer = gaspriceBigInt.toArrayLike(
      Buffer,
      "be",
      gaspriceBigInt.byteLength()
    );
    return Buffer.concat([Buffer.from("00", "hex"), gaspriceBuffer]);
}

