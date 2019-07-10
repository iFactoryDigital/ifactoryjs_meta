# EdenJS - Meta
[![TravisCI](https://travis-ci.com/eden-js/meta.svg?branch=master)](https://travis-ci.com/eden-js/meta)
[![Issues](https://img.shields.io/github/issues/eden-js/meta.svg)](https://github.com/eden-js/meta/issues)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/eden-js/meta)
[![Awesome](https://img.shields.io/badge/awesome-true-green.svg)](https://github.com/eden-js/meta)
[![Discord](https://img.shields.io/discord/583845970433933312.svg)](https://discord.gg/5u3f3up)

Meta base logic component for [EdenJS](https://github.com/edenjs-cli)

`@edenjs/meta` automatically adds middleware functions for metatag generation.

## Setup

### Install

```
npm i --save @edenjs/meta
```

### Functions

#### `res.meta` _[Usage](https://google.com)_

```js
/**
 * test action
 * 
 * @route {GET} /test
 */
testAction(req, res) {
  // add meta tag
  res.meta('name', 'content'); // translates to <meta name="name" content="content" />
}
```

#### `res.og` _[Usage](https://google.com)_

```js
/**
 * test action
 * 
 * @route {GET} /test
 */
testAction(req, res) {
  // add meta tag
  res.og('image', 'https://image.com/image.png', 'image'); // translates to <meta property="og:image" content="https://image.com/image.png" />
}
```

#### `res.article` _[Usage](https://google.com)_

```js
/**
 * test action
 * 
 * @route {GET} /test
 */
testAction(req, res) {
  // add meta tag
  res.article('image', 'https://image.com/image.png', 'image'); // translates to <meta property="article:image" content="https://image.com/image.png" />
}
```

#### `res.twitter` _[Usage](https://google.com)_

```js
/**
 * test action
 * 
 * @route {GET} /test
 */
testAction(req, res) {
  // add meta tag
  res.twitter('image', 'https://image.com/image.png', 'image'); // translates to <meta name="twitter:image" content="https://image.com/image.png" />
}
```

#### `res.title` _[Usage](https://google.com)_

```js
/**
 * test action
 * 
 * @route {GET} /test
 */
testAction(req, res) {
  // add meta tag
  res.title('Page Title'); // translates to <title>Page Title</title> as well as all appropriate meta tags
}
```

#### `res.description` _[Usage](https://google.com)_

```js
/**
 * test action
 * 
 * @route {GET} /test
 */
testAction(req, res) {
  // add meta tag
  res.description('Page Description'); // translates to <meta itemprop="description" name="description" content="Page Description" /> as well as all appropriate meta tags
}
```

#### `res.image` _[Usage](https://google.com)_

```js
/**
 * test action
 * 
 * @route {GET} /test
 */
testAction(req, res) {
  // add meta tag
  res.image('https://image.com/image.png', 100, 100); // translates to <meta itemprop="image" content="https://image.com/image.png" width="100" height="100" />
}
```