import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

console.log('--- Construindo Cardápio Salão (index.html) ---');
execSync('npx vite build', { stdio: 'inherit', env: { ...process.env, VITE_PAGE: 'main' } });

console.log('--- Construindo Cardápio Delivery (index2.html) ---');
execSync('npx vite build', { stdio: 'inherit', env: { ...process.env, VITE_PAGE: 'delivery' } });

// Synchronize to public root folders for hosting
const distDir = path.resolve(__dirname, 'dist');
const cardapioRestauranteDir = path.resolve(rootDir, 'cardapio-restaurante');
const cardapioDeliveryDir = path.resolve(rootDir, 'cardapio-delivery');

if (!fs.existsSync(cardapioRestauranteDir)) fs.mkdirSync(cardapioRestauranteDir, { recursive: true });
if (!fs.existsSync(cardapioDeliveryDir)) fs.mkdirSync(cardapioDeliveryDir, { recursive: true });

fs.copyFileSync(path.resolve(distDir, 'index.html'), path.resolve(cardapioRestauranteDir, 'index.html'));
fs.copyFileSync(path.resolve(distDir, 'index2.html'), path.resolve(cardapioDeliveryDir, 'index.html'));

console.log('✓ Cardápios sincronizados em cardapio-restaurante/ e cardapio-delivery/!');
