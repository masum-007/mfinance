<div align="center">

# 💰 MFinance

### A modern personal finance operating system for tracking cash flow, budgets, debts, subscriptions, and net worth.

MFinance is a full-stack personal finance dashboard built with **Next.js**, **React**, **TypeScript**, **Prisma**, **PostgreSQL**, and **Supabase Auth**.

It is designed to give users a clear picture of where their money is, where it is going, what they owe, what others owe them, and how closely they are following their monthly spending goals.

[🚀 Live Demo](https://mfinance-masum.netlify.app/) · [📘 User Guide](./user-guide.md) · [🐛 Report an Issue](https://github.com/masum-007/mfinance/issues)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3FCF8E?logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Netlify](https://img.shields.io/badge/Deployed_on-Netlify-00C7B7?logo=netlify&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Why MFinance?](#why-mfinance)
- [Core Features](#core-features)
- [How the Financial Model Works](#how-the-financial-model-works)
- [Architecture](#architecture)
- [Database ER Diagram](#database-er-diagram)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Live Demo](#live-demo)
- [Backend / API Documentation](#backend--api-documentation)
- [Development Decisions](#development-decisions)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database and Supabase Setup](#database-and-supabase-setup)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
- [Current Limitations](#current-limitations)
- [Potential Roadmap](#potential-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Overview

**MFinance** is a personal finance management application focused on making day-to-day money tracking simple while still supporting more advanced financial workflows.

Instead of keeping balances, expenses, debts, budgets, and recurring bills in separate spreadsheets or notes, MFinance brings them together in one dashboard.

The application currently supports:

- authenticated user accounts,
- multiple financial accounts/wallets,
- income and expense transactions,
- automatic balance updates,
- overdraft protection for expenses,
- custom income and expense categories,
- monthly category budgets,
- budget usage warnings,
- personal debts and receivables,
- debt repayments and loan collections,
- recurring subscription tracking,
- estimated monthly subscription burn rate,
- net worth calculations,
- spending charts,
- category breakdown charts,
- date-period filtering,
- CSV exports,
- currency, locale, and time-zone display preferences,
- desktop and mobile responsive layouts.

The project is currently at **v0.1.0** and is actively evolving.

---

## Why MFinance?

Personal finance information is often fragmented across:

- bank accounts,
- mobile financial services,
- cash wallets,
- spreadsheets,
- subscription services,
- informal loans,
- debt notes,
- budgeting apps.

MFinance provides a single financial workspace where all of those records can be represented in a consistent model.

The project is built around a few principles:

### 1. One source of truth

Account balances, transactions, debts, budgets, and subscriptions should stay connected instead of being managed independently.

### 2. Financial actions should update related data together

For example, recording an expense updates both:

1. the transaction history, and
2. the affected account balance.

Debt operations use database transactions so related writes are committed together.

### 3. Users should understand their position quickly

The dashboard focuses on a few high-value numbers:

- current liquid balance,
- net worth,
- income for the selected period,
- expenses for the selected period.

### 4. Good defaults, without unnecessary complexity

MFinance uses a clean UI, server-side data fetching, Server Actions, and a relational database rather than requiring a separate frontend API client and backend application.

---

# Core Features

## 📊 Dashboard & Analytics

The dashboard acts as the financial command center.

It provides:

- **Current Balance** — total cash across all accounts.
- **Net Worth** — cash plus receivables minus liabilities.
- **Period Income** — total income for the selected period.
- **Period Expenses** — total expenses for the selected period.
- **Period Filter** — all time, current month, previous month, or year-to-date.
- **Spending Trend** — recent transaction activity displayed with Recharts.
- **Category Breakdown** — expense distribution by category.
- **CSV Export** — export the currently loaded dashboard transactions.

The dashboard is rendered using server-side data from Prisma and sends only the chart data needed by client-side Recharts components.

---

## 🏦 Accounts

MFinance supports multiple places where a user can keep money.

Examples include:

- bank accounts,
- mobile financial services,
- cash wallets.

Each account has:

- a name,
- an account type,
- a current balance,
- transaction history,
- related subscriptions.

Users can:

- create an account,
- define its starting balance,
- add money manually,
- see the current balance,
- delete an account.

A manual deposit creates an `ADJUSTMENT` transaction so the balance change remains visible in financial history.

---

## 💸 Transactions

Transactions are the core activity records in MFinance.

The transaction interface currently focuses on:

- **Income**
- **Expense**

Users can assign each transaction to:

- an account,
- a category,
- an amount,
- an optional reference note.

### Search and filtering

Transaction history can be filtered by:

- transaction type,
- note,
- account name,
- category name.

### Overdraft protection

Before an expense is recorded, MFinance checks the selected account balance.

If:

```text
expense amount > available account balance
```

the transaction is rejected.

This protects the internal account balance from becoming inaccurate due to an accidental overspend entry.

---

## 🎯 Monthly Budgets

Budgets are created per **expense category**, month, and year.

For every category, the budgeting screen calculates:

```text
spent = sum of current-month expenses in the category

remaining = budget limit - spent

usage percentage = spent / budget limit × 100
```

MFinance visually warns the user when budget usage reaches **90% or more**.

The database also enforces one budget per user/category/month/year combination.

---

## 🤝 Debts & Receivables

MFinance tracks both sides of informal lending.

### People I Owe

When the user borrows money:

- a debt record is created,
- the selected account balance increases,
- a `BORROW` transaction is created,
- the borrowed amount is treated as a liability.

### Others Owe Me

When the user lends money:

- a receivable record is created,
- the selected account balance decreases,
- a `LEND` transaction is created,
- the amount owed back is treated as an asset.

### Repayments

When a user repays money they owe:

- the debt balance decreases,
- the selected account balance decreases,
- a `DEBT_REPAYMENT` transaction is recorded.

When someone repays money owed to the user:

- the receivable balance decreases,
- the selected account balance increases,
- a `LOAN_COLLECTION` transaction is recorded.

When the remaining amount reaches zero, the debt is marked as `SETTLED`.

---

## 🔁 Subscriptions

Recurring bills can be stored with:

- service name,
- amount,
- monthly or yearly billing cycle,
- next billing date,
- payment account,
- expense category,
- active status.

MFinance calculates an estimated **monthly burn rate**.

```text
monthly subscription = amount

yearly subscription = amount / 12
```

The result gives the user a quick estimate of recurring monthly financial commitments.

---

## 🏷️ Categories

Users can create custom:

- income categories,
- expense categories.

Example income categories:

- Salary
- Freelance
- Allowance

Example expense categories:

- Groceries
- Rent
- Transport
- Tuition
- Entertainment

Categories are used by transactions, budgets, and subscriptions.

---

## 🌍 Regional Preferences

MFinance supports configurable display preferences for:

### Currencies

- USD
- BDT
- EUR
- GBP
- INR
- SGD
- JPY
- CAD
- AUD

### Locales

- English — United States
- English — Bangladesh
- বাংলা — Bangladesh
- English — United Kingdom
- English — Singapore
- हिन्दी — India

### Time zones

- UTC
- Dhaka
- Singapore
- Kolkata
- London
- New York
- Sydney

These preferences are stored in **Supabase Auth user metadata**.

> **Important:** changing the selected currency changes formatting and labels only. MFinance does not currently perform foreign-exchange conversion.

---

## 📱 Responsive Experience

The interface has dedicated desktop and mobile navigation behavior.

### Desktop

- persistent sidebar,
- direct links to all finance modules,
- full-width analytical dashboard.

### Mobile

- responsive layouts,
- hamburger navigation drawer,
- touch-friendly cards and dialogs,
- mobile-ready transaction entry.

---

# How the Financial Model Works

## Current Balance

```text
Current Balance =
sum of all account balances
```

---

## Net Worth

MFinance calculates net worth as:

```text
Net Worth =
Current Account Balance
+ Money Others Owe You
- Money You Owe Others
```

or:

```text
Net Worth = Liquid Cash + Receivables - Liabilities
```

This is why borrowing money does not automatically make the user wealthier:

```text
+ cash
- liability
= no net-worth gain
```

Similarly, lending money moves value from cash into a receivable:

```text
- cash
+ receivable
= no net-worth loss
```

---

## Transaction Types

The Prisma schema currently defines the following transaction types:

| Type | Purpose |
| --- | --- |
| `INCOME` | Money entering an account |
| `EXPENSE` | Money leaving an account |
| `TRANSFER` | Reserved for account-to-account transfers |
| `BORROW` | Money received as a debt/liability |
| `DEBT_REPAYMENT` | Repayment of money the user owes |
| `LEND` | Money lent to another person |
| `LOAN_COLLECTION` | Money collected from someone who owes the user |
| `ADJUSTMENT` | Manual account balance adjustment/deposit |

---

# Architecture

MFinance uses Next.js as both the application framework and backend execution layer.

Instead of maintaining a separate REST backend, the application uses:

- **Server Components** for authenticated data reads,
- **Server Actions** for mutations,
- **Supabase Auth** for identity and sessions,
- **Prisma** for database access,
- **PostgreSQL** for financial records,
- **Client Components** for dialogs, forms, charts, navigation, and CSV downloads.

## High-Level Architecture Diagram

```mermaid
flowchart TB
    USER["User / Browser"]

    subgraph APP["MFinance — Next.js 16"]
        ROUTER["App Router"]
        SERVER["Server Components<br/>Dashboard + authenticated reads"]
        CLIENT["Client Components<br/>Dialogs + forms + charts + CSV export"]
        ACTIONS["Server Actions<br/>Financial mutations"]
        CALLBACK["Auth Callback Route<br/>GET /auth/callback"]
        REVALIDATE["Next.js Cache Revalidation<br/>revalidatePath()"]
    end

    AUTH["Supabase Auth<br/>Email/password sessions"]
    META["Supabase User Metadata<br/>currency + locale + time zone"]

    PRISMA["Prisma 7<br/>@prisma/adapter-pg"]
    POSTGRES[("PostgreSQL")]
    CHARTS["Recharts"]

    NETLIFY["Netlify<br/>Application Hosting"]

    NETLIFY -. hosts .-> APP

    USER --> ROUTER
    ROUTER --> SERVER
    ROUTER --> CLIENT

    SERVER --> AUTH
    SERVER --> PRISMA

    CLIENT --> ACTIONS
    CLIENT --> CHARTS

    ACTIONS --> AUTH
    ACTIONS --> PRISMA
    ACTIONS --> REVALIDATE

    CALLBACK --> AUTH
    AUTH --> META

    PRISMA --> POSTGRES
```

---

## Request / Mutation Flow

A typical financial mutation follows this flow:

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client Component
    participant A as Next.js Server Action
    participant S as Supabase Auth
    participant P as Prisma
    participant D as PostgreSQL

    U->>C: Submit finance form
    C->>A: Invoke Server Action
    A->>S: Resolve authenticated user
    S-->>A: User session / UUID
    A->>P: Validate ownership / query records
    P->>D: Read current data
    D-->>P: Data
    P-->>A: Current state
    A->>P: Execute financial mutation
    P->>D: Atomic database write(s)
    D-->>P: Commit
    A-->>C: Result
    A->>A: revalidatePath()
    C-->>U: Updated UI
```

---

# Database ER Diagram

The database schema is relational and user-scoped.

```mermaid
erDiagram
    USER ||--o{ ACCOUNT : owns
    USER ||--o{ CATEGORY : defines
    USER ||--o{ TRANSACTION : records
    USER ||--o{ DEBT : tracks
    USER ||--o{ BUDGET : creates
    USER ||--o{ SUBSCRIPTION : owns

    ACCOUNT ||--o{ TRANSACTION : contains
    ACCOUNT ||--o{ SUBSCRIPTION : pays

    CATEGORY o|--o{ TRANSACTION : classifies
    CATEGORY ||--o{ BUDGET : limits
    CATEGORY o|--o{ SUBSCRIPTION : classifies

    USER {
        string id PK
        string email UK
        string name
        datetime createdAt
    }

    ACCOUNT {
        string id PK
        string userId FK
        string name
        string type
        decimal balance
        datetime createdAt
        datetime updatedAt
    }

    CATEGORY {
        string id PK
        string userId FK
        string name
        string type
    }

    TRANSACTION {
        string id PK
        string userId FK
        string accountId FK
        string categoryId FK
        string type
        decimal amount
        string currency
        string counterpartyName
        string note
        datetime transactionDate
        string status
        datetime createdAt
        datetime updatedAt
    }

    DEBT {
        string id PK
        string userId FK
        string type
        string counterpartyName
        decimal amount
        decimal remainingAmount
        datetime dueDate
        string status
        datetime createdAt
        datetime updatedAt
    }

    BUDGET {
        string id PK
        string userId FK
        string categoryId FK
        decimal amount
        int month
        int year
        datetime createdAt
        datetime updatedAt
    }

    SUBSCRIPTION {
        string id PK
        string userId FK
        string accountId FK
        string categoryId FK
        string name
        decimal amount
        string billingCycle
        datetime nextDate
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
```

## Main database constraints

### User

- `email` is unique.

### Budget

The combination below is unique:

```text
userId + categoryId + month + year
```

That means a user can have only one monthly budget for a category.

### Cascading ownership

Several user-owned models use cascading deletes from the `User` relationship.

Account deletion is handled explicitly by the account Server Action so related transactions and subscriptions can be removed as part of the same operation.

---

# Tech Stack

| Technology | Role |
| --- | --- |
| **Next.js 16** | Full-stack application framework and App Router |
| **React 19** | Component-based UI |
| **TypeScript 5** | Static typing and safer application code |
| **Prisma 7** | ORM, schema modeling, queries, and database transactions |
| **@prisma/adapter-pg** | Prisma PostgreSQL driver adapter |
| **PostgreSQL** | Relational financial data storage |
| **Supabase Auth** | Authentication, sessions, and user metadata |
| **Tailwind CSS 4** | Responsive utility-first styling |
| **shadcn** | UI component system |
| **Base UI** | Accessible UI primitives |
| **Recharts** | Dashboard charts and visualizations |
| **Lucide React** | Interface icons |
| **next-themes** | Theme infrastructure |
| **Netlify** | Current hosted deployment |

---

# Project Structure

```text
mfinance/
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── actions.ts
│   │   │   └── callback/
│   │   │       └── route.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── accounts/
│   │   │   │   ├── actions.ts
│   │   │   │   ├── create-account-dialog.tsx
│   │   │   │   ├── add-money-dialog.tsx
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── transactions/
│   │   │   │   ├── actions.ts
│   │   │   │   ├── create-transaction-dialog.tsx
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── budgets/
│   │   │   │   ├── actions.ts
│   │   │   │   ├── set-budget-dialog.tsx
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── debts/
│   │   │   │   ├── actions.ts
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── subscriptions/
│   │   │   │   ├── actions.ts
│   │   │   │   ├── add-sub-dialog.tsx
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   ├── actions.ts
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── analytics-charts.tsx
│   │   ├── ui/
│   │   ├── export-button.tsx
│   │   └── theme-provider.tsx
│   │
│   └── lib/
│       ├── prisma.ts
│       ├── localization.ts
│       └── supabase/
│           ├── client.ts
│           └── server.ts
│
├── components.json
├── next.config.ts
├── package.json
├── prisma.config.ts
├── tsconfig.json
├── user-guide.md
└── README.md
```

---

# Screenshots

> The repository does not currently include a dedicated screenshot set.  
> For the README below to render screenshots, create a `docs/screenshots/` directory and save captures using the filenames shown here.

## Dashboard

```text
docs/screenshots/dashboard.png
```

![MFinance Dashboard](docs/screenshots/dashboard.png)

**What it shows**

- current balance,
- net worth,
- period income,
- period expenses,
- date filtering,
- spending trend chart,
- category breakdown,
- CSV export.

---

## Accounts

```text
docs/screenshots/accounts.png
```

![MFinance Accounts](docs/screenshots/accounts.png)

**What it shows**

- bank/mobile/cash accounts,
- current account balances,
- new-account flow,
- manual account deposits,
- account management.

---

## Transactions

```text
docs/screenshots/transactions.png
```

![MFinance Transactions](docs/screenshots/transactions.png)

**What it shows**

- income and expense history,
- account/category labels,
- search,
- type filtering,
- new transaction entry,
- overdraft protection.

---

## Budgets

```text
docs/screenshots/budgets.png
```

![MFinance Budgets](docs/screenshots/budgets.png)

**What it shows**

- category-level monthly targets,
- amount spent,
- amount remaining,
- progress percentage,
- 90% budget warning state.

---

## Debts

```text
docs/screenshots/debts.png
```

![MFinance Debts](docs/screenshots/debts.png)

**What it shows**

- people the user owes,
- people who owe the user,
- remaining amounts,
- due dates,
- repayments and collections.

---

## Subscriptions

```text
docs/screenshots/subscriptions.png
```

![MFinance Subscriptions](docs/screenshots/subscriptions.png)

**What it shows**

- recurring services,
- monthly/yearly billing,
- next billing dates,
- associated accounts/categories,
- monthly subscription burn rate.

---

## Settings

```text
docs/screenshots/settings.png
```

![MFinance Settings](docs/screenshots/settings.png)

**What it shows**

- income and expense categories,
- user account information,
- currency settings,
- locale settings,
- time-zone settings,
- active budgets,
- upcoming subscriptions,
- open-debt alerts.

---

# Live Demo

The current hosted demo is available at:

### 🌐 https://mfinance-masum.netlify.app/

You can use the demo to explore the public landing page and application flow.

Repository:

### 💻 https://github.com/masum-007/mfinance

---

# Backend / API Documentation

## Important: MFinance currently uses Server Actions, not a public REST API

MFinance does **not** currently expose a general REST API such as:

```text
GET /api/accounts
POST /api/transactions
```

Instead, application mutations are implemented as **Next.js Server Actions**.

This keeps the current web architecture simple:

```text
React form / component
        ↓
Next.js Server Action
        ↓
Supabase Auth session
        ↓
Prisma
        ↓
PostgreSQL
        ↓
revalidatePath()
        ↓
Updated Server Component
```

The following functions form the current internal backend contract.

---

## Authentication

File:

```text
src/app/auth/actions.ts
```

### `login(formData)`

**Input**

```text
email
password
```

**Behavior**

1. Creates a Supabase server client.
2. Calls `supabase.auth.signInWithPassword(...)`.
3. Redirects authentication errors back to `/login`.
4. Revalidates the root layout.
5. Redirects the user to `/dashboard`.

---

### `signup(formData)`

**Input**

```text
name
email
password
```

**Behavior**

1. Creates a Supabase user.
2. Saves `name` in Supabase Auth metadata.
3. Revalidates the root layout.
4. Redirects to `/dashboard`.

---

## Auth Callback Route

```http
GET /auth/callback
```

Supported query parameters:

| Parameter | Description |
| --- | --- |
| `code` | Supabase authorization code |
| `next` | Optional redirect destination; defaults to `/dashboard` |

Behavior:

1. exchanges the authorization code for a Supabase session,
2. redirects to the requested page when successful,
3. redirects to `/login?error=Authentication failed` when unsuccessful.

---

## Account Actions

File:

```text
src/app/dashboard/accounts/actions.ts
```

### `createAccount(formData)`

**Input**

```text
name
type
balance
```

Creates a user-owned financial account.

---

### `addMoneyToAccount(accountId, amount, note)`

Atomically:

1. increases the selected account balance,
2. creates an `ADJUSTMENT` transaction,
3. revalidates dashboard/account/transaction pages.

---

### `deleteAccount(accountId)`

Atomically removes:

1. transactions connected to the account,
2. subscriptions connected to the account,
3. the account itself.

---

## Transaction Actions

File:

```text
src/app/dashboard/transactions/actions.ts
```

### `createTransaction(formData)`

**Input**

```text
type
amount
accountId
categoryId
note
```

Supported UI transaction types:

```text
INCOME
EXPENSE
```

Validation includes:

- authenticated user,
- positive amount,
- account requirement,
- account ownership,
- available balance for expenses.

For a successful transaction:

```text
INCOME  -> account balance increases
EXPENSE -> account balance decreases
```

The account balance update and transaction creation occur inside a Prisma database transaction.

Possible error result:

```ts
{
  error: string
}
```

---

## Budget Actions

File:

```text
src/app/dashboard/budgets/actions.ts
```

### `setBudgetLimit(categoryId, amount, month, year)`

Creates a new monthly budget or updates the existing budget for:

```text
user + category + month + year
```

---

## Debt Actions

File:

```text
src/app/dashboard/debts/actions.ts
```

### `createDebtEntry(formData)`

**Input**

```text
type
amount
person
accountId
dueDate
```

Supported debt types:

```text
Owe
Lent
```

For `Owe`:

```text
account balance += amount
transaction type = BORROW
```

For `Lent`:

```text
account balance -= amount
transaction type = LEND
```

The debt, account balance, and transaction record are updated in one Prisma database transaction.

---

### `repayDebt(debtId, accountId, amountToRepay)`

For money the user owes:

```text
remaining debt -= payment
account balance -= payment
transaction type = DEBT_REPAYMENT
```

For money owed to the user:

```text
remaining receivable -= payment
account balance += payment
transaction type = LOAN_COLLECTION
```

When the remaining amount reaches zero:

```text
status = SETTLED
```

---

## Subscription Actions

File:

```text
src/app/dashboard/subscriptions/actions.ts
```

### `createSubscription(formData)`

**Input**

```text
name
amount
billingCycle
nextDate
accountId
categoryId
```

Creates an active recurring subscription.

Supported billing cycles:

```text
MONTHLY
YEARLY
```

---

### `toggleSubscription(id, currentStatus)`

Switches:

```text
active -> inactive
inactive -> active
```

and revalidates the subscriptions page.

---

## Settings Actions

File:

```text
src/app/dashboard/settings/actions.ts
```

### `createCategory(formData)`

Creates a custom income or expense category.

Input:

```text
name
type
```

Types:

```text
INCOME
EXPENSE
```

---

### `deleteCategory(formData)`

Deletes a category owned by the authenticated user.

---

### `updateLocalization(formData)`

Updates Supabase Auth user metadata.

Input:

```text
currency
locale
timeZone
```

The action validates each value against the application's supported configuration before saving it.

---

## Adding a Public REST API Later

If mobile apps, integrations, or external clients are added in the future, REST endpoints can be implemented using Next.js Route Handlers:

```text
src/app/api/accounts/route.ts
src/app/api/transactions/route.ts
src/app/api/budgets/route.ts
src/app/api/debts/route.ts
src/app/api/subscriptions/route.ts
```

A future public API should include:

- explicit authentication,
- ownership checks,
- request validation,
- consistent error responses,
- pagination,
- rate limiting,
- OpenAPI documentation.

---

# Development Decisions

## Why Next.js?

Next.js is used because MFinance benefits from having frontend and backend behavior in the same project.

### Benefits for this project

- Server Components can query financial data directly on the server.
- Server Actions handle mutations without a separate API application.
- File-based routing keeps finance modules organized.
- `revalidatePath()` makes it easy to refresh affected pages after a mutation.
- The App Router supports both server and client components.
- Authentication logic can remain on the server where appropriate.
- Deployment can be handled as a single application.

For a project of this size, this avoids unnecessary frontend/backend duplication.

---

## Why React?

The application contains many interactive UI patterns:

- modal forms,
- filters,
- responsive navigation,
- account cards,
- transaction forms,
- charts,
- settings tabs.

React makes these features easy to structure as reusable components.

---

## Why TypeScript?

Financial applications benefit from predictable data structures.

TypeScript helps catch:

- incorrect component props,
- invalid transaction-type usage,
- accidental nullable values,
- interface mismatches during development.

It also works naturally with Prisma's generated database types.

---

## Why Prisma?

Prisma provides a strongly typed layer between the application and PostgreSQL.

MFinance uses Prisma for:

- schema modeling,
- relational queries,
- generated TypeScript types,
- decimal financial values,
- nested relationship loading,
- atomic database transactions.

Financial operations often affect several records together.

For example:

```text
Create debt
+ update account
+ create financial transaction
```

Prisma's `$transaction()` allows those operations to be committed as a single unit.

---

## Why PostgreSQL?

The financial model is relational.

Examples:

```text
User -> Accounts
User -> Categories
Account -> Transactions
Category -> Budgets
Account -> Subscriptions
```

PostgreSQL is a strong fit because it provides:

- relational integrity,
- transactions,
- unique constraints,
- decimal values,
- reliable querying,
- mature production tooling.

---

## Why Supabase Auth?

Authentication is separated from the financial database access layer.

Supabase Auth handles:

- user registration,
- email/password login,
- browser sessions,
- server-side session access,
- Auth user metadata.

MFinance uses Supabase metadata for preferences such as:

- currency,
- locale,
- time zone.

The financial data itself is queried through Prisma/PostgreSQL.

---

## Why Server Actions Instead of a REST API?

The current application is a web-only Next.js product.

Server Actions reduce boilerplate because the UI can call server-side functions directly.

Instead of:

```text
Component
-> fetch()
-> API route
-> validation layer
-> service
-> ORM
```

MFinance currently uses:

```text
Component
-> Server Action
-> Prisma
```

A public API can be added later if an external client actually needs it.

---

## Why Recharts?

Recharts provides responsive React-native chart components and integrates cleanly with the dashboard.

MFinance currently uses it for:

- spending trend visualization,
- expense-category breakdown.

---

## Why Tailwind CSS + shadcn/Base UI?

The combination provides:

- fast responsive styling,
- consistent spacing,
- accessible primitives,
- reusable dialog/form/card components,
- easy visual iteration.

This is especially useful for a dashboard with many repeated interface patterns.

---

## Why Netlify?

The current public demo is deployed on Netlify.

For this project, a single hosting target keeps deployment straightforward while still supporting the Next.js application.

---

# Getting Started

## Prerequisites

Before running MFinance locally, install:

- **Node.js 20+**
- **npm**
- access to a **PostgreSQL** database,
- a **Supabase** project for authentication.

---

## 1. Clone the repository

```bash
git clone https://github.com/masum-007/mfinance.git
cd mfinance
```

---

## 2. Install dependencies

```bash
npm install
```

The project also runs:

```bash
npx prisma generate
```

automatically through the `postinstall` script.

---

# Environment Variables

Create:

```text
.env.local
```

in the project root.

Add:

```env
# Runtime PostgreSQL connection used by src/lib/prisma.ts
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Direct database URL used by prisma.config.ts for Prisma CLI operations
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

## What each variable does

### `DATABASE_URL`

Used at application runtime by:

```text
src/lib/prisma.ts
```

The app creates a PostgreSQL connection pool and passes it to Prisma through `@prisma/adapter-pg`.

---

### `DIRECT_URL`

Used by:

```text
prisma.config.ts
```

for Prisma CLI database operations.

If your database provider gives you separate pooled and direct URLs, use:

```text
DATABASE_URL -> pooled/runtime connection
DIRECT_URL   -> direct/CLI connection
```

---

### `NEXT_PUBLIC_SUPABASE_URL`

The URL of your Supabase project.

---

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The public anonymous key used by the Supabase browser and server clients for authentication.

Never commit `.env.local` to the repository.

---

# Database and Supabase Setup

## 1. Create the database schema

Generate the Prisma client:

```bash
npx prisma generate
```

For a fresh development database, push the schema:

```bash
npx prisma db push
```

You can inspect the database with:

```bash
npx prisma studio
```

---

## 2. Configure Supabase Auth

In Supabase:

1. create a project,
2. enable Email/Password authentication,
3. copy the project URL,
4. copy the anonymous public key,
5. add them to `.env.local`.

---

## 3. Keep the application User record aligned with Supabase Auth

The application uses the Supabase authenticated user's UUID as `userId` throughout the Prisma financial tables.

The Prisma schema also contains a `User` model.

That means a fresh deployment should ensure:

```text
Supabase Auth user UUID == Prisma User.id
```

If your existing Supabase project already synchronizes Auth users into the application `User` table, keep that setup.

One possible approach is an Auth database trigger after the Prisma schema has been created.

Example for a fresh Supabase/PostgreSQL setup:

```sql
create or replace function public.handle_new_mfinance_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public."User" (
    id,
    email,
    name,
    "createdAt"
  )
  values (
    new.id::text,
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'name',
    now()
  )
  on conflict (id) do update
  set
    email = excluded.email,
    name = excluded.name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_mfinance_user();
```

> Review and adapt database triggers for your own deployment and security model before production use.

---

# Running the Project

## Development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Production build

```bash
npm run build
npm start
```

---

## Prisma Studio

```bash
npx prisma studio
```

---

# Deployment

The current project demo is hosted on **Netlify**.

A typical deployment flow is:

1. push the project to GitHub,
2. import the repository into Netlify,
3. configure the environment variables,
4. build the Next.js application,
5. connect the production PostgreSQL/Supabase resources.

Required production environment variables:

```text
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

The package configuration includes:

```text
postinstall -> npx prisma generate
```

so Prisma Client generation is automatically triggered after dependencies are installed.

---

# Current Limitations

MFinance is still under active development.

Current architectural/product limitations include:

- no general public REST API,
- no automatic foreign-exchange conversion,
- changing currency changes display formatting only,
- no transaction import workflow yet,
- no automated bank synchronization,
- no investment portfolio module,
- no automated test command currently defined in `package.json`,
- recurring subscriptions are tracked but are not a full billing engine,
- the repository currently does not include a dedicated screenshot directory,
- the repository currently does not include a `LICENSE` file.

These are normal areas for future expansion as the project matures.

---

# Potential Roadmap

Possible future additions:

- [ ] Public REST API
- [ ] OpenAPI / Swagger documentation
- [ ] Automated unit and integration tests
- [ ] End-to-end tests
- [ ] CSV transaction import
- [ ] Bank statement import
- [ ] Account-to-account transfer UI
- [ ] Automatic recurring subscription posting
- [ ] Multi-currency conversion with exchange rates
- [ ] Notification system
- [ ] Budget notifications
- [ ] Debt due-date reminders
- [ ] Subscription renewal reminders
- [ ] Investment tracking
- [ ] Savings goals
- [ ] Financial reports
- [ ] PDF report export
- [ ] PWA / offline support
- [ ] Audit log
- [ ] Stronger centralized input validation
- [ ] Mobile application
- [ ] Public developer API

---

# Contributing

Contributions are welcome.

## Development workflow

1. Fork the repository.

2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Make your changes.

4. Build the project before submitting:

```bash
npm run build
```

5. Commit your work:

```bash
git commit -m "feat: add your feature"
```

6. Push the branch:

```bash
git push origin feature/your-feature
```

7. Open a Pull Request.

When contributing to financial logic, pay special attention to:

- account ownership,
- atomic database transactions,
- decimal/money handling,
- validation,
- balance consistency,
- debt state consistency,
- user isolation.

---

# License

This repository currently does **not** include a `LICENSE` file.

If you intend to publish MFinance as open-source software, add a license such as MIT, Apache-2.0, GPL-3.0, or another license that matches your goals.

Until a license is added, do not assume reuse permissions beyond what copyright law and GitHub's Terms of Service provide.

---

# Financial Disclaimer

MFinance is a personal finance tracking and educational software project.

It does not provide:

- financial advice,
- investment advice,
- tax advice,
- accounting advice,
- legal advice.

Always verify important financial information independently.

---

# Author

**Masum Al Mahamud**

GitHub: [@masum-007](https://github.com/masum-007)

Project: [github.com/masum-007/mfinance](https://github.com/masum-007/mfinance)

Live Demo: [mfinance-masum.netlify.app](https://mfinance-masum.netlify.app/)

---

<div align="center">

### ⭐ If you find MFinance useful, consider starring the repository.

Built with ❤️ for better financial clarity.

</div>
