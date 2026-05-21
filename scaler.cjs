const pm2 = require('/usr/local/lib/node_modules/pm2');
const os  = require('os');

const APP_NAME       = 'gh-backend';
const CPU_SCALE_UP   = 60;
const CPU_SCALE_DOWN = 20;
const MAX_INSTANCES  = os.cpus().length;
const MIN_INSTANCES  = 1;
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

pm2.connect((err) => {
  if (err) { console.error(err); process.exit(1); }
  console.log(`Auto-scaler started — watching "${APP_NAME}" every 5 minutes`);
  checkAndScale();
  setInterval(checkAndScale, CHECK_INTERVAL);
});

function checkAndScale() {
  pm2.describe(APP_NAME, (err, list) => {
    if (err || !list.length) return;

    const current = list.length;
    const avgCpu  = list.reduce((sum, p) => sum + (p.monit?.cpu || 0), 0) / current;

    console.log(`[scaler] instances=${current}  avg_cpu=${avgCpu.toFixed(1)}%`);

    if (avgCpu > CPU_SCALE_UP && current < MAX_INSTANCES) {
      const next = Math.min(current + 1, MAX_INSTANCES);
      console.log(`[scaler] CPU ${avgCpu.toFixed(1)}% > ${CPU_SCALE_UP}% → scaling UP to ${next}`);
      pm2.scale(APP_NAME, next, (e) => { if (e) console.error('[scaler] scale up error:', e); });

    } else if (avgCpu < CPU_SCALE_DOWN && current > MIN_INSTANCES) {
      const next = Math.max(current - 1, MIN_INSTANCES);
      console.log(`[scaler] CPU ${avgCpu.toFixed(1)}% < ${CPU_SCALE_DOWN}% → scaling DOWN to ${next}`);
      pm2.scale(APP_NAME, next, (e) => { if (e) console.error('[scaler] scale down error:', e); });
    }
  });
}
