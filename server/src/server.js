require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');
const { getDb, migrate } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const ORIGIN = process.env.CORS_ORIGIN || '*';
const APP_BASE_URL = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
const APP_CLIENT_URL = process.env.APP_CLIENT_URL || 'http://localhost:8081';

// Email desativado neste fluxo simplificado

migrate();

app.use(helmet());
app.use(cors({ origin: ORIGIN }));
app.use(express.json());

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'missing_token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'missing_fields' });
  }
  const db = getDb();
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) return res.status(409).json({ error: 'email_in_use' });

  const password_hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO users (name, email, phone, password_hash, verified, verification_token) VALUES (?, ?, ?, ?, 1, NULL)')
    .run(name, email, phone || null, password_hash);
  const user = { id: info.lastInsertRowid, name, email, phone: phone || null };
  const token = createToken({ id: user.id, email: user.email });
  return res.status(201).json({ user, token });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'missing_fields' });
  const db = getDb();
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row) return res.status(401).json({ error: 'invalid_credentials' });
  const ok = bcrypt.compareSync(password, row.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
  const user = { id: row.id, name: row.name, email: row.email, phone: row.phone };
  const token = createToken({ id: user.id, email: user.email });
  return res.json({ user, token });
});

app.get('/me', authMiddleware, (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT id, name, email, phone FROM users WHERE id = ?').get(req.user.id);
  if (!row) return res.status(404).json({ error: 'not_found' });
  return res.json({ user: row });
});

// Resend verification
app.post('/auth/send-verification', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'missing_email' });
  const db = getDb();
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row) return res.status(404).json({ error: 'not_found' });
  if (row.verified) return res.json({ ok: true });
  const verification_token = row.verification_token || crypto.randomBytes(32).toString('hex');
  if (!row.verification_token) {
    db.prepare('UPDATE users SET verification_token = ? WHERE id = ?').run(verification_token, row.id);
  }
  const verifyLink = `${APP_BASE_URL}/auth/verify?token=${verification_token}`;
  const message = {
    from: FROM_EMAIL,
    to: email,
    subject: 'Verifique seu e-mail',
    text: `Clique no link para confirmar seu e-mail: ${verifyLink}`,
    html: `<p>Clique no link para confirmar seu e-mail:</p><p><a href="${verifyLink}">${verifyLink}</a></p>`,
  };
  if (transporter) transporter.sendMail(message).catch(err => console.error('Email error:', err));
  else console.log('[DEV] Verification link:', verifyLink);
  return res.json({ ok: true });
});

// Verify link
app.get('/auth/verify', (req, res) => {
  const token = req.query.token;
  if (!token || typeof token !== 'string') return res.status(400).send('Invalid token');
  const db = getDb();
  const row = db.prepare('SELECT * FROM users WHERE verification_token = ?').get(token);
  if (!row) return res.status(400).send('Invalid or expired token');
  db.prepare('UPDATE users SET verified = 1, verification_token = NULL WHERE id = ?').run(row.id);
  // Issue a token and redirect to the client app to auto-login
  const appToken = createToken({ id: row.id, email: row.email });
  const redirectUrl = `${APP_CLIENT_URL}/auth-verified?token=${encodeURIComponent(appToken)}`;
  return res.redirect(302, redirectUrl);
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
