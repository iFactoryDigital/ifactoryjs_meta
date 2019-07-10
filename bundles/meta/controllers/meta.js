/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-destructuring */
// Use strict


// Require dependencies
const uuid       = require('uuid');
const config     = require('config');
const sitemap    = require('sitemap');
const Controller = require('controller');

/**
 * Build meta controller
 *
 * @priority 90
 */
class MetaController extends Controller {
  /**
   * Construct example controller class
   */
  constructor() {
    // Run super eden
    super();

    // Bind private variables
    this._sitemap = null;

    // Bind private methods
    this._compile = this._compile.bind(this);
    this._generate = this._generate.bind(this);
    this._middleware = this._middleware.bind(this);

    // Run middleware
    this.eden.router.use(this._middleware);

    // On render
    this.eden.pre('view.compile', this._compile);

    // Generate sitemap
    if (config.get('sitemap') && config.get('sitemap.enabled')) {
      // Generate on interval
      this._generate();

      // Set interval
      if (config.get('sitemap.interval')) setInterval(this._generate, config.get('sitemap.interval'));
    }
  }

  /**
   * Create sitemap
   *
   * @param  {Request}   req
   * @param  {Response}  res
   *
   * @route  {get} /sitemap.xml
   *
   * @return {Promise}
   */
  async sitemap(req, res, next) {
    // Check sitemap
    if (!this._sitemap) return next();

    // Return sitemap
    return this._sitemap.toXML((err, xml) => {
      // Check error
      if (err) return next();

      // Set header
      res.header('Content-Type', 'application/xml');

      // Send xml
      return res.send(xml);
    });
  }

  /**
   * Generates xml
   *
   * @return {Promise}
   */
  async _generate() {
    // Create sitemap
    const map = {
      hostname  : `https://${config.get('domain')}`,
      cacheTime : config.get('sitemap.cache') || 600000,
      urls      : [
        {
          url        : '',
          priority   : 1,
          changefreq : 'daily',
        },
      ],
    };

    // Hook generate
    await this.eden.hook('sitemap', map);

    // Create
    this._sitemap = sitemap.createSitemap(map);

    // Add to eden
    this.eden.sitemap = this._sitemap;

    // Trigger sitemap
    this.eden.emit('sitemap');
  }

  /**
   * Compile view
   *
   * @param  {Object}  render
   *
   * @return {Promise}
   */
  async _compile(render) {
    // Check meta
    const meta = render.state.meta || {};

    // Delete meta
    delete render.state.meta;

    // Create head
    if (!render.page.head) render.page.head = '';

    // Sort types
    const types = Object.keys(meta).sort();

    // Loop meta
    types.forEach((type) => {
      // Sort names
      let names = Object.keys(meta[type]);

      // Check if meta
      if (type === 'meta') {
        names = names.sort((a, b) => {
        // Return a/b
          a = (meta[type][a].property || meta[type][a].name || '').split(':')[0];
          b = (meta[type][b].property || meta[type][b].name || '').split(':')[0];

          // Return sorted
          return a > b ? -1 : a < b ? 1 : 0;
        });
      }

      // Loop for name
      names.forEach((name) => {
        // Let value
        const keys  = Object.keys(meta[type][name]).sort().reverse();
        const value = meta[type][name];

        // Add to head
        render.page.head += `<${type}`;

        // Loop for tags
        for (let i = 0; i < keys.length; i += 1) {
          // Check tag
          if (keys[i] === 'id') continue;

          // Add tag
          render.page.head += ` ${keys[i]}="${value[keys[i]]}"`;
        }

        // Close tag
        render.page.head += ' />';
      });
    });
  }

  /**
   * Build middleware
   *
   * @param  {request}  req Express request
   * @param  {response} res Express response
   * @param  {function} next Next callback
   *
   * @private
   */
  async _middleware(req, res, next) {
    // Create meta function
    const metaMiddleware = (type, opts) => {
      // Check type and opts
      if (typeof type === 'object' || !opts) {
        // Set variables
        opts = type;
        type = 'meta';
      }

      // Get name
      const name = opts.id || uuid();

      // Check type
      if (type === 'title') return req.title(opts);
      if (type === 'image') return req.image(opts);
      if (type === 'description') return req.description(opts);

      // Check opts
      if (typeof opts === 'string') {
        opts = {
          name    : type,
          content : opts,
        };
        type = 'meta';
      }

      // Check if meta exists
      if (!res.locals.meta) res.locals.meta = {};

      // Check meta type
      if (!res.locals.meta[type]) res.locals.meta[type] = {};

      // Set meta
      res.locals.meta[type][name] = opts;

      // Return req
      return res;
    };

    // set to req/res
    req.meta = metaMiddleware;
    res.meta = metaMiddleware;

    // Create description
    const ogMiddleware = (name, content, id) => {
      // Add description
      req.meta({
        id,
        content,
        property : `og:${name}`,
      });

      // Return req
      return res;
    };

    // set to req/res
    req.og = ogMiddleware;
    res.og = ogMiddleware;

    // Create description
    const articleMiddleware = (name, content, id) => {
      // Add description
      req.meta({
        id,
        content,
        property : `article:${name}`,
      });

      // Return req
      return res;
    };

    // set to req/res
    req.article = articleMiddleware;
    res.article = articleMiddleware;

    // Create description
    const twitterMiddleware = (name, content, id) => {
      // Add description
      req.meta({
        id,
        name    : `twitter:${name}`,
        content,
      });

      // Return req
      return res;
    };

    // add to req/res
    req.twitter = twitterMiddleware;
    res.twitter = twitterMiddleware;

    // Create description
    const titleMiddleware = (title) => {
      // Set title
      res.locals.page = res.locals.page || {};

      // Set title
      res.locals.page.title = req.t(title);

      // Add description
      req.og('title', req.t(title), 'og:title');
      req.meta({
        id       : 'title',
        content  : req.t(title),
        itemprop : 'name',
      });
      req.twitter('title', req.t(title), 'twitter:title');

      // Return req
      return res;
    };

    // add to req/res
    req.title = titleMiddleware;
    res.title = titleMiddleware;

    // Create description
    const descriptionMiddleware = (description) => {
      // Trim description
      if (description.length > 160) {
        // Get descriotion
        const split = description.substring(0, 160).split(' ');

        // Slice
        description = split.splice(0, (split.length - 1)).join(' ');
      }

      // Add description
      req.og('description', description, 'og:description');
      req.meta({
        id       : 'description',
        name     : 'description',
        content  : description,
        itemprop : 'description',
      });
      req.twitter('description', description, 'twitter:description');

      // Return req
      return res;
    };

    // add to req/res
    req.description = descriptionMiddleware;
    res.description = descriptionMiddleware;

    // Create description
    const imageMiddleware = (url, width, height) => {
      // Add image
      req.og('image', url);

      // Set size
      if (width) req.og('image:width', width);
      if (height) req.og('image:height', height);

      // Set url
      req.og('image:url', url);
      req.og('image:secure_url', url);

      // Set itemprop
      req.meta({
        content  : url,
        itemprop : 'image',
      });

      // Set twitter
      req.twitter('image', url);

      // Return req
      return res;
    };

    // add to req/res
    req.image = imageMiddleware;
    res.image = imageMiddleware;

    // Set default title
    req.title(config.get('title'));

    // Set default
    req.og('url', `https://${config.get('domain')}${req.url}`, 'og:url');
    req.og('locale', req.language, 'og:locale');
    req.twitter('card', 'summary', 'twitter:summary');
    req.twitter('site', config.get('title'), 'twitter:site');

    // Run next
    next();
  }
}

/**
 * Export meta controller
 *
 * @type {MetaController}
 */
module.exports = MetaController;
