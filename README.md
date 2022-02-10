## solana-token-metadata-update


```
$ yarn set --env devnet GqGR9Y3yK53WiBvPwc3VHWdQBP4jd5mBNjFEnjmodoQp

$ yarn update --env devnet GqGR9Y3yK53WiBvPwc3VHWdQBP4jd5mBNjFEnjmodoQp
```




```
$ spl-token create-token
Creating token 76aBHVZUvZ96iDa2r2DQbnYQnz7eiBdWJP9cqieTHUVf

Signature: 3NEig9drX8vKbaaVc5xizMY1AW2riWRVwR5FkZ7JFnFJ2DH9VEQ4jY6SMhTAmzn1xR12vUXqphcTkt5YxB2uX3UC
```
**Create ATA Account**
```
$ spl-token create-account 76aBHVZUvZ96iDa2r2DQbnYQnz7eiBdWJP9cqieTHUVf
Creating account 7paLe919PvQuZ96qhq1Nqqkwm7uDYqJAAPEmT2wsnwJi

Signature: 3nAoRzaNLEJCapWbyrbet5aGxZwnozLcxrPspN1JCQdruhmEuKKmNgvxoHrQGpsPfQX7mRcfD8GLofjtT89HL58h

$ spl-token mint 76aBHVZUvZ96iDa2r2DQbnYQnz7eiBdWJP9cqieTHUVf 200000000

Minting 200000000 tokens
  Token: 76aBHVZUvZ96iDa2r2DQbnYQnz7eiBdWJP9cqieTHUVf
  Recipient: 7paLe919PvQuZ96qhq1Nqqkwm7uDYqJAAPEmT2wsnwJi

Signature: 25RQ1viyEFgJYQct6RJiyLKjA2UESSj84ceDvLDP8ByXPQfWYXTAEW2JBdacdshtwzqxCCtC6ZuciMoxyc3r46NA

https://explorer.solana.com/address/76aBHVZUvZ96iDa2r2DQbnYQnz7eiBdWJP9cqieTHUVf?cluster=devnet
```

**lock**

```
$ yarn lock --env devnet 76aBHVZUvZ96iDa2r2DQbnYQnz7eiBdWJP9cqieTHUVf
```

**Set Metadata**

```
$ yarn set --env devnet 76aBHVZUvZ96iDa2r2DQbnYQnz7eiBdWJP9cqieTHUVf

$ yarn update --env devnet GqGR9Y3yK53WiBvPwc3VHWdQBP4jd5mBNjFEnjmodoQp
```
