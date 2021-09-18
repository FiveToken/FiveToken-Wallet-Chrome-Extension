/* eslint-disable no-undef */
import {
  getT1SignedMsg
} from '@/utils/message.js'

test('fn getT1SignedMsg()', async () => {
  const message = {
    From: 'f16wkgzlglyejqlougingwbnztnp7lrh2xgzlbviq',
    GasFeeCap: '484484067',
    GasLimit: 784908,
    GasPremium: '119955',
    Method: 0,
    Nonce: 338,
    Params: '',
    To: 'f134ljmsuc6ab45jiaf2qjahs3j2vl6jv7pm5oema',
    Value: '1000000000000000',
    Version: 0
  }
  const pk = 'DOwj7viv+ulyRNhJLM04ls2pbb6pBV3XvQn/JSSW2Sc='
  const signMsg = {
    Message: {
      From: 'f16wkgzlglyejqlougingwbnztnp7lrh2xgzlbviq',
      GasFeeCap: '484484067',
      GasLimit: 784908,
      GasPremium: '119955',
      Method: 0,
      Nonce: 338,
      Params: '',
      To: 'f134ljmsuc6ab45jiaf2qjahs3j2vl6jv7pm5oema',
      Value: '1000000000000000',
      Version: 0
    },
    Signature: {
      Data: 'Fc84/kzTbK+0U9sO7NEwD/zEOGnxsbfhPQqg87+9Tuxy5njAqxwMfFt3ySTTqD5HVOki+a5V4Bs/6BEyL4BcYQA=',
      Type: 1
    }
  }
  expect(await getT1SignedMsg(message, pk)).toEqual(signMsg)
})
