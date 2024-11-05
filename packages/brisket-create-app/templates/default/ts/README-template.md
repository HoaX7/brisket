This is a [Fastify](https://fastify.dev/) backend project bootstraped with `[brisket-create-app](https://github.com/HoaX7/brisket/packages/brisket-create-app)`.

# Get Started

First, run the development server

```bash
# install dependencies
npm install

npm run dev
# or
yarn dev
# or
pnpm dev
```

Create `.env` file with your env vars.

```bash
HOST=0.0.0.0
PORT=3000
```

Open http://localhost:3000 with your browser to see the result.

## Features
- Typescript & Eslint
- Logger configured with winston
- Best practices for folder and code structure
- Optimized Dockerfile

# Deployment
The easiest way to deploy your application is to create docker containers.

```bash
# build the application
docker built -t <image> .

# run the docker image
docker run -d --restart unless-stopped -p 3000:3000 --env-file .env <image>
```