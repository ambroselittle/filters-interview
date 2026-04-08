# Setup

## Node.js

We recommend using [nvm](https://github.com/nvm-sh/nvm) to install the exact
version Node.js expected by this project. Quick installation commands:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Then run `nvm install` to install and use the project version in `.nvmrc`.

## Package Dependencies

In the project root, run `npm install` to install all workspace dependencies.

# Running

- In the project root, run `npm start` to start both client and server concurrently
- Or start them individually:
  - `npm run dev:client` to start only the client dev server
  - `npm run dev:server` to start only the server dev server

Open `http://localhost:1234`. There should be a table of borrower data.

# Tech Stack

- **Javascript Runtime**: Node.js 22
- **Package Manager**: npm 10
- **Language**: TypeScript 5.9
- **Client**: React 19 + Vite
- **Server**: Express 5 + tsx (TypeScript execution)
