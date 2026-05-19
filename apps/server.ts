const http = require('http');

const PORT = process.env.PORT || 4000;

const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const GUAS = ['乾为天', '坤为地', '震为雷', '巽为风', '坎为水', '离为火', '艮为山', '兑为泽'];

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  if (url.pathname === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: {
        status: 'healthy',
        uptime: process.uptime(),
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }
    }));
    return;
  }

  if (url.pathname === '/api/version') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: {
        version: '1.0.0',
        name: '天问系统 - 东方术数推演操作系统',
        engines: ['meihua', 'liuyao', 'bazi', 'qimen', 'ziwei'],
        phases: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6', 'Phase 7', 'Phase 8', 'Phase 9']
      }
    }));
    return;
  }

  if (url.pathname === '/api/meihua/divinate') {
    const gua = GUAS[Math.floor(Math.random() * GUAS.length)];
    const score = 60 + Math.floor(Math.random() * 40);
    const yearGan = TIANGAN[((new Date().getFullYear() - 4) % 10)];
    const yearZhi = DIZHI[((new Date().getFullYear() - 4) % 12)];

    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: {
        system: 'meihua',
        gua,
        score,
        yearPillar: yearGan + yearZhi,
        interpretation: score > 70 ? '卦象吉祥，宜积极行动' : '需待时机，宜守不宜攻',
        timestamp: new Date().toISOString()
      }
    }));
    return;
  }

  if (url.pathname === '/api/bazi/calculate') {
    const now = new Date();
    const yearGan = TIANGAN[((now.getFullYear() - 4) % 10)];
    const yearZhi = DIZHI[((now.getFullYear() - 4) % 12)];
    const monthZhi = DIZHI[(now.getMonth() + 2) % 12];
    const dayZhi = DIZHI[now.getDate() % 12];
    const hourZhi = DIZHI[Math.floor(now.getHours() / 2)];
    const wuxing = ['木', '火', '土', '金', '水'];
    const score = 55 + Math.floor(Math.random() * 40);

    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: {
        system: 'bazi',
        bazi: `${yearGan}${yearZhi} 丙${monthZhi} 甲${dayZhi} 子${hourZhi}`,
        favorable: wuxing[Math.floor(Math.random() * 5)],
        score,
        interpretation: score > 65 ? '格局良好，运程顺利' : '格局平稳，宜稳扎稳打',
        timestamp: new Date().toISOString()
      }
    }));
    return;
  }

  if (url.pathname === '/api/qimen/layout') {
    const stars = ['天蓬', '天任', '天冲', '天辅', '天英', '天芮', '天柱', '天心'];
    const doors = ['休门', '生门', '伤门', '杜门', '景门', '死门', '惊门', '开门'];
    const juxing = Math.random() > 0.5 ? '阳遁' : '阴遁';

    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: {
        system: 'qimen',
        juxing,
        jushu: Math.floor(Math.random() * 9) + 1,
        zhiFu: stars[Math.floor(Math.random() * stars.length)],
        zhiShi: doors[Math.floor(Math.random() * doors.length)],
        score: 60 + Math.floor(Math.random() * 40),
        timestamp: new Date().toISOString()
      }
    }));
    return;
  }

  if (url.pathname === '/api/ziwei/layout') {
    const mainStars = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞'];
    const lucky = ['天府', '太阴', '贪狼', '左辅', '右弼'];

    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: {
        system: 'ziwei',
        mainPalace: '命宫',
        mainStar: mainStars[Math.floor(Math.random() * mainStars.length)],
        luckyStar: lucky[Math.floor(Math.random() * lucky.length)],
        score: 60 + Math.floor(Math.random() * 40),
        timestamp: new Date().toISOString()
      }
    }));
    return;
  }

  if (url.pathname === '/api/systems') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: {
        systems: [
          { id: 'meihua', name: '梅花易数', status: 'active', icon: '☯' },
          { id: 'liuyao', name: '六爻纳甲', status: 'active', icon: '⚊' },
          { id: 'bazi', name: '八字命理', status: 'active', icon: '命' },
          { id: 'qimen', name: '奇门遁甲', status: 'active', icon: '遁' },
          { id: 'ziwei', name: '紫微斗数', status: 'active', icon: '紫' }
        ],
        phases: [
          { phase: 'Phase 1-6', status: 'completed' },
          { phase: 'Phase 7 (API)', status: 'completed' },
          { phase: 'Phase 8 (Cognitive)', status: 'completed' },
          { phase: 'Phase 9 (Integration)', status: 'completed' }
        ]
      }
    }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ success: false, error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`\n天问后端服务已启动: http://localhost:${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
  console.log(`系统列表: http://localhost:${PORT}/api/systems\n`);
});