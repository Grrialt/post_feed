#!/bin/sh

# build the contract
npm run build

# deploy the contract
near deploy --accountId anadev.testnet --wasmFile build/contract.wasm