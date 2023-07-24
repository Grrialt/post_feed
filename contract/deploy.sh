#!/bin/sh

# build the contract
pnpm run build

# deploy the contract
near dev-deploy --wasmFile build/contract.wasm