#!/bin/sh

# build the contract
yarn build

# deploy the contract
near dev-deploy --wasmFile build/contract.wasm