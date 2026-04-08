const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Map of allowed price IDs — only these can be checked out
const ALLOWED_PRICES = {
  'digital-hd':         'price_1TJMgZRqX2egPtxdTpQIcGGP',
  'poster-22x28':       'price_1TJMgaRqX2egPtxdoWBCSS20',
  'canvas-10x20':       'price_1TJMgZRqX2egPtxdkjLtQhLR',
  'canvas-10x24':       'price_1TJMgYRqX2egPtxd7tFy251F',
  'canvas-12x36':       'price_1TJMgYRqX2egPtxdLEPXPS3U',
  'metal-8x10':         'price_1TJMgYRqX2egPtxdj1HsGxTk',
  'metal-10x20':        'price_1TJMgYRqX2egPtxdYZDXt6Yr',
  'metal-12x36':        'price_1TJMgYRqX2egPtxd9MoXbFfo',
  'metal-12x36-framed': 'price_1TJMgYRqX2egPtxdzqvFgXag',
  'titanium-4x6':       'price_1TJMgYRqX2egPtxdbInmf06A',
  'titanium-6x9':       'price_1TJMgYRqX2egPtxdnWHb7CUq',
  'titanium-8x12':      'price_1TJMgYRqX2egPtxdhg6XEPD1',
};

// Products that require shipping
const PHYSICAL_PRODUCTS = [
  'poster-22x28', 'canvas-10x20', 'canvas-10x24', 'canvas-12x36',
  'metal-8x10', 'metal-10x20', 'metal-12x36', 'metal-12x36-framed',
  'titanium-4x6', 'titanium-6x9', 'titanium-8x12',
];

const ALLOWED_COUNTRIES = [
  'US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'JP'
];

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://codexaeterna.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productKey, starId, starTitle, starAuthor, lineStyle } = req.body;

    // Validate product key
    const priceId = ALLOWED_PRICES[productKey];
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid product' });
    }

    // Build metadata for order fulfillment
    const metadata = {
      product_key: productKey,
      star_id: starId || '',
      star_title: (starTitle || '').substring(0, 500),
      star_author: (starAuthor || '').substring(0, 500),
      line_style: lineStyle || 'solid',
    };

    // Session config
    const sessionConfig = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      metadata,
      success_url: 'https://codexaeterna.com/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://codexaeterna.com/order.html',
    };

    // Add shipping for physical products
    if (PHYSICAL_PRODUCTS.includes(productKey)) {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ALLOWED_COUNTRIES,
      };
    }

    // Allow promo codes
    sessionConfig.allow_promotion_codes = true;

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
