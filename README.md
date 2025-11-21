# Irarium

A space for thoughts

## Getting Started

Everything can be hosted on a single server, DB included. I recommend using hetzner for cost efficiency along with Coolify for convenience.

### Development Setup

**1. Install dependencies:**

```bash
pnpm install
```

**2. Set up PocketBase:**

Download the [PocketBase executable](https://pocketbase.io/docs/) for your platform and place it in the `pocketbase/` folder.

```bash
cd pocketbase
./pocketbase serve
```

The PocketBase admin UI will be available at `http://127.0.0.1:8090/_/`

Fill in `PUBLIC_POCKETBASE_URL` in `.env` like so: `PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090`

**3. Run the development server:**

In a separate terminal:

```bash
pnpm run dev
```

The app will be available at `http://localhost:5173`
