const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 8080;

const isBreachMode = process.argv.includes('--mode') && process.argv.includes('breach');

app.use((req, res, next) => {
    if (isBreachMode) {
        console.log(`\n🕵️ [MitM SNIFFER] Перехоплено запит: ${req.method} ${req.url}`);
        
        if (req.headers.cookie) {
            console.log(`🚨 БРАУЗЕР ПЕРЕДАВ КУКІ: ${req.headers.cookie}`);
        } else {
            console.log(`   (Кукі немає)`);
        }
    }
    next(); 
});

app.use('/', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
}));

app.listen(port, () => {
    console.log(`Proxy (MitM) is running on http://localhost:${port}`);
    console.log(`Breach Mode: ${isBreachMode}`);
});