dchan-client
-----
Official client for the [dchan.network](https://dchan.network) decentralized imageboard.

* Lightweight
* IPFS hostable
* Built with [React](https://reactjs.org/)
* Powered by [The Graph](https://thegraph.com)

# Docker
Required:
- [`docker`](https://docs.docker.com/engine/install/#server) 
- [`docker-compose`](https://docs.docker.com/compose/install/)

## Start development
- `./scripts/docker/setup.sh` 
  - Only run the first time
- `./scripts/docker/dev.sh`
  - `yarn start`

## Release production build
- `./scripts/docker/dapp/release.sh`
  - or `yarn build` in docker dev

## Serve production build
- `./scripts/docker/dapp/serve.sh`
  - `http://localhost:8080`

# Links
- Official website: https://dchan.network/
- Source: https://github.com/dchan-network/dchan-client
- More: https://github.com/dchan-network/
