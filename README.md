![Unit Tests](https://github.com/benyakirten/chat-app/actions/workflows/unit_test.yml/badge.svg)
![E2E Tests](https://github.com/benyakirten/chat-app/actions/workflows/playwright.yml/badge.svg)

## What is this?

What you're looking at is a Nuxt frontend for a chat app. The [backend](https://github.com/benyakirten/chat-api) uses Elixir Phoenix for API endpoints and socket connections. Users can engage in private conversations and group conversations, both of which have e2e encryption. Socket interactions are done through the [Phoenix JS package](https://www.npmjs.com/package/phoenix).

## How do I run this?

1. Clone the repository as well as the backend.
1. Configure and run the backend.
1. Run `cp .env.example .env`
1. Run `bun dev`

## Environment variables

You must define the following environment :

```bash
COOKIE_SECRET
WS_URL
API_BASE_URL
```

**NOTE**: A quick way to generate a secret in Node is (for the `COOKIE_SECRET`):

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

Run `bun dev`. If you want to use another package manager, you will have to install the packages before doing so.

## Discutable Features

### Authentication

Authentication is token-based, but, since Nuxt allows for HTTP-only cookies, it is stored in cookies. However, the token needs to be transmitted on all socket interactions so it is also stored in memory. Auth token lifespan is 30 minutes, but refresh tokens are valid for up to two weeks. Auth tokens will be automatically renewed through the [./auth/silent](`/server/routes/silent.post.ts`) endpoint. In addition, if a socket interaction is rejected by the backend for an invalid token, it will attempt up to three times (per type of interaction) to renew the token.

### Tracking Recently Viewed Pages

The recently viewed pages is tracked per user. This is done through a LRU cache. [The implementation](./utils/recents.ts) isn't the most efficient since it uses a set and returns it as an array, but I wanted to try something different. A better approach would be the classical two-array solution, especially since it stores teh data in contiguous memory.

### Tracking the Most Recent Conversation

Although the implemtntation is very similar to the LRU cache above, I couldn't it. NuxtJS transmits state between client in server in JSON using [devalue](https://github.com/nuxt-contrib/devalue). It allows for custom classes to be used, but I couldn't get it to work in a timely manner. Therefore I use an array, which is probably for the best since the only functionality needed was to splice an item from one place to another.

### SSR Difficulties

The layout and components rendered on the conversations page change between desktop and mobile layout as shown [here](./components/chat/Layout.vue). I decided on this approach instead of a CSS-only solution because I wanted to try something new instead of using the old hidden checkbox feature. The additional complexity is less than nice, and the need to make sure the store is not hydrated (because the `matchMedia` function is not available server-side, for obvious reasons) is regrettable.

Including this issue, I bumped up into an issue with SSR when trying to get a user's color theme preference. It would always flash a frame of the computer's current theme even after the user logged in, no matter the user's preference. Therefore, to solve this, the last theme used for the page is stored in local storage.

## Why

For the last two years, I have not been able to work on personal projects. When I looked back on my
portfolio, I saw a lot of projects that are old. They have good parts and things that I like, but certain features (especially older-looking user interfaces), weren't good. They didn't make me happy to present as a representative of my abilities.

I always like taking on new challenges and working with technologies that I haven't used before, so I chose
Vue (okay, I used Vue 2 previously, but I don't have anything with Nuxt or Vue 3), WebSockets and Elixir/Phoenix. Not
only did I use Vue 3, but I experimented with a bunch of CSS techniques that I didn't get to use at my job:
`color-mix`, `dialog::backdrop`, gradients of all styles, other package managers, etc.

I wanted to build something with the following goals:

1. Use WebSockets.
2. Have encryption.
3. Have a simple but nice user interface.

If you want to learn more about me, visit my blog at [Benyakir Writes](https://benyakir-writes.com) or my [GitHub page](https://github.com/benyakirten).

## Future Features

These are the things I would like to address when I have more time:

1. Replacing modals with pages or letting modals be accessed through a URL.
1. Define and complete the search functionality.
1. Allow conversations to be filtered/sorted.
1. Building out functionality for a block list.
1. Increase user/chatroom discoverability (right now group conversations are invite only).
1. Allow some sort of hierarchical control over group conversations and messages (messages can only be edited/deleted by their owner, group conversations are invite-only, and only you can leave it, which is rife for abuse).
1. Making the account settings page look good and make the statistics more well-thought out.
1. Expand user preferences (probably in service of chatroom discoverability), including avatars and images.
1. Make the chat input be able to parse code, upload images/videos, etc.
1. Allow users to disable color theme cookie if so desired.
