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

### Hooks

#### `sitemap` _[Usage](https://github.com/eden-js/meta/blob/master/bundles/meta/controllers/meta.js#L96)_

The sitemap hook allows you to add things to the global sitemap. _[Usage](https://github.com/eden-js/shop/blob/master/bundles/product/controllers/product.js#L49)_

```js
// pre sitemap
this.eden.pre('sitemap', async (map) => {
  // get products
  const products = await Product.find({
    published : true,
  });

  // get categories
  await Promise.all(products.map(async (product) => {
    // add to eden
    map.urls.push({
      url : `/product/${product.get('slug')}`,
      img : await Promise.all((await product.get('images') || []).map(async (image) => {
        // return image
        return {
          url     : await image.url('md-sq'),
          title   : product.get('title.en-us'),
          caption : image.get('name'),
          license : 'https://creativecommons.org/licenses/by/4.0/',
        };
      })),
      lastmod    : product.get('updated_at'),
      priority   : 0.8,
      changefreq : 'daily',
    });
  }));
});
```

This can also be done in a build function. _[Usage](https://github.com/eden-js/shop/blob/master/bundles/product/controllers/product.js#L49)_


```js
/**
 * order individual item
 */
const build = () => {
  // get categories
  (await Product.find({
    published : true,
  })).map(async (product) => {
    // add to eden
    // this.eden must be in a controller/daemon extended the core daemon/controller
    this.eden.sitemap.add({
      url : `/product/${product.get('slug')}`,
      img : await Promise.all((await product.get('images') || []).map(async (image) => {
        // return image
        return {
          url     : await image.url('md-sq'),
          title   : product.get('title.en-us'),
          caption : image.get('name'),
          license : 'https://creativecommons.org/licenses/by/4.0/',
        };
      })),
      lastmod    : product.get('updated_at'),
      priority   : 0.8,
      changefreq : 'daily',
    });
  });
}
```

### Functions

#### `res.meta` _[Usage](https://github.com/eden-js/meta/blob/master/bundles/meta/controllers/meta.js#L180)_

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

#### `res.og` _[Usage](https://github.com/eden-js/meta/blob/master/bundles/meta/controllers/meta.js#L223)_

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

#### `res.article` _[Usage](https://github.com/eden-js/meta/blob/master/bundles/meta/controllers/meta.js#L240)_

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

#### `res.twitter` _[Usage](https://github.com/eden-js/meta/blob/master/bundles/meta/controllers/meta.js#L257)_

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

#### `res.title` _[Usage](https://github.com/eden-js/meta/blob/master/bundles/meta/controllers/meta.js#L274)_

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

#### `res.description` _[Usage](https://github.com/eden-js/meta/blob/master/bundles/meta/controllers/meta.js#L299)_

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

#### `res.image` _[Usage](https://github.com/eden-js/meta/blob/master/bundles/meta/controllers/meta.js#L328)_

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