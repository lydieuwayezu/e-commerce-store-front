// seed.mjs  — run with:  node seed.mjs
import axios from 'axios';

const BASE = 'https://e-commas-apis-production.up.railway.app';
const api = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' } });

const setToken = (token) => { api.defaults.headers.common['Authorization'] = `Bearer ${token}`; };
const log  = (msg) => console.log(`✅  ${msg}`);
const warn = (msg) => console.log(`⚠️   ${msg}`);
const fail = (msg, e) => console.error(`❌  ${msg}:`, e?.response?.data ?? e.message);

async function main() {
  console.log('\n🌱  Starting seed...\n');

  // ── Fetch existing products ──────────────────────────────────────────────
  let products = [];
  try {
    const res = await api.get('/api/public/products');
    products = res.data?.data?.all ?? [];
    log(`Found ${products.length} existing products`);
  } catch (e) { fail('Fetch products', e); return; }

  // ── Fetch existing categories ────────────────────────────────────────────
  try {
    const res = await api.get('/api/categories');
    const cats = res.data?.data ?? [];
    log(`Found ${cats.length} existing categories`);
    console.log('\nSample categories:');
    cats.slice(0, 5).forEach((c) => console.log(`  - ${c.name} (${c.id})`));
  } catch (e) { fail('Fetch categories', e); }

  // ── Find products that have variants ────────────────────────────────────
  const withVariants = products.filter(p => p.variants?.length > 0);
  log(`Products with variants: ${withVariants.length}`);
  if (withVariants.length > 0) {
    console.log('\nSample products with variants:');
    withVariants.slice(0, 3).forEach(p => {
      console.log(`  - ${p.name} | variant: ${p.variants[0].id} | $${p.variants[0].price}`);
    });
  }

  // ── Register test user ───────────────────────────────────────────────────
  const testUser = { email: 'jane@test.com', password: 'Password123' };
  try {
    await api.post('/api/auth/users/register', testUser);
    log(`Test user registered: ${testUser.email}`);
  } catch (e) { warn(`User ${testUser.email} may already exist`); }

  // ── Login test user ──────────────────────────────────────────────────────
  try {
    const res = await api.post('/api/auth/users/login', testUser);
    const token = res.data?.data?.token ?? res.data?.token;
    if (!token) { warn('No token returned'); return; }
    setToken(token);
    log('Test user logged in');
  } catch (e) { fail('Test user login', e); return; }

  // ── Add items to cart (only products with variants) ──────────────────────
  if (withVariants.length >= 2) {
    for (const p of withVariants.slice(0, 2)) {
      try {
        await api.post('/api/auth/cart/items', {
          productId: p.id,
          variantId: p.variants[0].id,
          quantity: 1,
        });
        log(`Added to cart: ${p.name}`);
      } catch (e) { fail(`Add to cart (${p.name})`, e); }
    }

    // ── Place order ────────────────────────────────────────────────────────
    try {
      const res = await api.post('/api/auth/orders');
      const order = res.data?.data ?? res.data;
      log(`Order placed! id: ${order?.id ?? 'unknown'}`);
    } catch (e) { fail('Place order', e); }
  } else {
    warn('Not enough products with variants to place order');
  }

  console.log('\n🎉  Done!\n');
  console.log('─────────────────────────────────');
  console.log('Test user credentials:');
  console.log(`  Email:    ${testUser.email}`);
  console.log(`  Password: ${testUser.password}`);
  console.log('─────────────────────────────────\n');
}

main();
