# Echo

> **Echo** is an AI-powered customer support platform designed as a modern B2B SaaS solution.  
> Built with cutting-edge AI integrations, secure infrastructure, and a developer-friendly architecture.

---

## 🚀 Tech Stack

![pnpm](https://img.shields.io/badge/pnpm-workspace-yellow?logo=pnpm) &nbsp;
![Turborepo](https://img.shields.io/badge/monorepo-turborepo-blue?logo=turbo) &nbsp;
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs) &nbsp;
![React](https://img.shields.io/badge/React-19-61dafb?logo=react) &nbsp;
![Tailwind](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwindcss) &nbsp;
![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-white) &nbsp;
![Convex](https://img.shields.io/badge/Backend-Convex-purple) &nbsp;
![Clerk](https://img.shields.io/badge/Auth-Clerk-red?logo=clerk) &nbsp;
![AWS](https://img.shields.io/badge/Secrets-AWS-orange?logo=amazonaws) &nbsp;
![VAPI](https://img.shields.io/badge/Voice-VAPI-blue) &nbsp;
![OpenAI](https://img.shields.io/badge/AI-OpenAI-black?logo=openai) &nbsp;
![Sentry](https://img.shields.io/badge/Error%20Tracking-Sentry-purple?logo=sentry) &nbsp;
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## ✨ Key Features

- 🤖 Real-time AI Chat with Convex Agents
- 📣 Human Handoff & Auto-Close
- 🧠 Smart Knowledge Base using Embeddings + RAG
- 🔊 Voice Support via VAPI
- 🔑 Secure Key Storage (AWS Secrets Manager)
- 👥 Team Management with Clerk
- 🔐 Authentication & Billing with Clerk
- 🛠️ Embeddable Widget for Websites
- 📈 Operator Dashboard for Conversations & Analytics
- 🧰 Developer Toolkit for Embed Script
- 🧠 AI Model Support: OpenAI, Anthropic, Grok
- 🌐 Next.js 15 + React 19 + Tailwind v4
- 🧩 Components from shadcn/ui
- 📦 Monorepo with Turborepo + pnpm
- 🪵 Error Tracking via Sentry

---

## 📂 Project Structure

```
echo/
│
├── apps/                     # Applications
│   ├── web/                  # Main Next.js app (Operator Dashboard, SaaS frontend)
│   └── widget/               # Embeddable customer support widget
│
├── packages/                 # Shared packages
│   ├── backend/              # Convex backend functions & APIs
│   ├── ui/                   # Shared shadcn/ui components
│   ├── config/               # ESLint, Tailwind, TS configs
│   └── utils/                # Shared utility functions
│
├── turbo.json                # Turborepo pipeline config
├── pnpm-workspace.yaml       # pnpm workspace setup
├── package.json              # Root config (scripts, dev tools)
└── README.md
```

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hha297/Echo.git
cd Echo
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Setup environment variables

You’ll need **three `.env` files**:

#### 📦 `packages/backend/.env`

```
# Convex Deployment
CONVEX_DEPLOYMENT=dev:your-deployment-id
CONVEX_URL=https://your-convex-url.convex.cloud

# Clerk (Server-side)
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk.accounts.dev
CLERK_SECRET_KEY=sk_test_your_key_here

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# AWS
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=eu-north-1
```

#### 🌐 `apps/web/.env`

```
# Convex
NEXT_PUBLIC_CONVEX_URL="https://your-convex-url.convex.cloud"

# Clerk (Frontend + Server)
NEXT_PUBLIC_CLERK_FRONTEND_API_URL="https://your-clerk.accounts.dev"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Sentry
SENTRY_AUTH_TOKEN="your-sentry-token"
```

#### 💬 `apps/widget/.env`

```
# Convex
NEXT_PUBLIC_CONVEX_URL="https://your-convex-url.convex.cloud"
```

### 4. Run development servers

```bash
pnpm dev
OR
turbo dev
```

- `apps/web` → http://localhost:3000
- `apps/widget` → http://localhost:3001

### 5. Build for production

```bash
pnpm build
```
