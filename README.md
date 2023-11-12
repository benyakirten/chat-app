![Unit Tests](https://github.com/benyakirten/chat-app/actions/workflows/unit_test.yml/badge.svg)
![E2E Tests](https://github.com/benyakirten/chat-app/actions/workflows/playwright.yml/badge.svg)

# Table Of Contents

1. [What is this?](#what-is-this)
2. [How do I run this?](#how-do-i-run-this)
3. [Why?](#why)
4. [What's missing?](#whats-missing)

## What is this?

This is a chat app. So far it has few features added, but there are a lot planned. To be exact:

1. User Interface (what you're looking at)
2. Authentication
3. Communication with a backend
4. E2E Encryption
5. The ability to find other users based on some sort of criteria
6. Finish unit tests and add e2e tests/storybook stories

## How do I run this?

You must define the following environment variables:

```bash
COOKIE_SECRET
WS_URL
API_BASE_URL
```

**NOTE**: A quick way to generate a secret in Node is:

```js
require('crypto').randomBytes(24).toString('base64')
```

The following environment variables are optional:

```bash
AUTH_COOKIE_NAME # defaults to __auth
COOKIE_EXPIRES # defaults to 604800000, the amount of milliseconds in a week
THEME_COOKIE_NAME # defaults to __theme
```

Examples for the required cookies (that should work on local development if you're running the [`chat_api` server](https://github.com/benyakirten/chat-api)). You can copy them by running:

```bash
cp .env.example .env
```

Run `bun dev`. If you want to use another package manager, you will have to install the packages before doing so. You
might be thinking about building/testing/etc. You can read the details in `package.json`, but because there's no
backend, this is pretty static for now.

The following environment variables must be defined:

This is not currently hosted anywhere. When it gets to a good place, I will attempt to host the front and backends.

## Why

For the last year and a half, I have not been able to work on personal projects. And so when I looked back on my
portfolio, I saw a lot of projects that are old. They have good parts, and there are things that I like. But
things, especially the user interfaces, weren't good. They didn't make me happy to present as a representative
of me.

I always like taking on new challenges and working with technologies that I haven't used before, so I chose
Vue (okay, I used Vue 2, but I don't have anything with Nuxt or Vue 3), WebSockets and Elixir/Phoenix. Not
only did I use Vue 3, but I experimented with a bunch of CSS techniques that I didn't get to use at my job:
`color-mix`, `dialog::backdrop`, gradients of all styles, other package managers, etc.
And I'm incorporating some things I learned: Storybook and Playwright.

If you want to learn more about me, visit my blog at [Benyakir Writes](https://benyakir-writes.com).

## What's missing

If you've taken a look through this, you'll notice there are a lot of things that look incomplete.
For exmaple, the modals and the account settigns page. They don't look great, but I came to the conclusion
that I was floundering and not coming up with great ideas. I think my time would be better used to write
the backend while I come up with a design for them. There are also a myriad of small bugs in the UI such
as tooltips being a little off. I also feel like this reflects my professional experience, where you just
have to stop work on some things and shift priorities at times. Things will definitely be adjusted, but
I am investing a lot of time into fixing small things that aren't adding a lot of value.

These are the things I would like to address when I have more time:

1. Building out functionality for an ignore/block list (I am mostly unsure of the exact details of how one works)
2. Making modals look good and have validation (right now it's pretty rough - I want to use Zod)
3. Making the account settings page look good and make the statistics part more well-thought out
4. Make the light theme less ick
5. Give you a better way to look at someone's details

```

```
