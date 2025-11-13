# Irarium

A space for thoughts and ideas.

Each irarium starts with a root (idea/thought), and from there creating a tree of related thoughts and ideas.

## Documentation

- [Roadmap](docs/ROADMAP.md) — Features planned and in progress
- [Requirements](docs/REQUIREMENTS.md) — Technical standards and goals
- [Features](docs/FEATURES.md) — Detailed specs for upcoming features
- [Stripe Integration](docs/STRIPE.md) — Payment testing setup

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- [PocketBase](https://pocketbase.io/) executable

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

**3. Run the development server:**

In a separate terminal:

```bash
pnpm run dev
```

The app will be available at `http://localhost:5173`

### Available Commands

- `pnpm run dev` — Start development server
- `pnpm run dev:db` — Start PocketBase (alternative to manual start)
- `pnpm run build` — Build for production
- `pnpm run preview` — Preview production build
- `pnpm run lint` — Run linter
- `pnpm run format` — Format code
- `pnpm run check` — Type checking
- `pnpm run test:unit` — Run unit tests
- `pnpm run test:e2e` — Run E2E tests

For Stripe integration and testing payments, see [docs/STRIPE.md](docs/STRIPE.md).
