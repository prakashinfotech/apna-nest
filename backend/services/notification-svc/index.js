const express = require('express');
const crypto = require('crypto');

const notificationApiKey = process.env.NOTIFICATION_API_KEY;
if (!notificationApiKey || notificationApiKey.length < 32) {
  throw new Error('NOTIFICATION_API_KEY must be configured with at least 32 characters');
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

function requireNotificationApiKey(req, res, next) {
  const authorization = req.get('authorization') || '';
  const suppliedKey = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : req.get('x-api-key') || '';
  const expected = Buffer.from(notificationApiKey);
  const supplied = Buffer.from(suppliedKey);

  if (expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

app.use('/notify', requireNotificationApiKey, require('./routes/notify'));
app.listen(3001, () => console.log('Notification service on :3001'));
