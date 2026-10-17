const { cpSync, existsSync, rmSync } = require('node:fs');
const path = require('node:path');
const source = path.resolve(__dirname, '../client/dist/client/browser');
const target = path.resolve(__dirname, '../server/public');
if (!existsSync(path.join(source, 'index.html'))) throw new Error('Build the client before copying it');
rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });
