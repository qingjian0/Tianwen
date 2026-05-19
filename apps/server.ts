/**
 * 天问 - 真实后端服务
 * 直接连接所有术数引擎，提供 REST API
 */

import http from 'http';
import { MeihuaEngine } from '@tianwen/meihua';
import { BaZiEngine } from '@tianwen/bazi-engine';
import { LiuYaoEngine } from '@tianwen/liuyao';
import { QimenEngine } from '@tianwen/qimen';
import { ZiweiEngine } from '@tianwen/ziwei';

const PORT = parseInt(process.env.PORT || '4000');

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

function json(res: http.ServerResponse, code: number, body: ApiResponse) {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(body, null, 2));
}

function parseBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const path = url.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  try {
    // === 系统接口 ===
    if (path === '/api/health') {
      json(res, 200, {
        success: true,
        data: { status: 'healthy', uptime: process.uptime(), engines: ['meihua','liuyao','bazi','qimen','ziwei'] }
      });
      return;
    }

    if (path === '/api/systems') {
      json(res, 200, {
        success: true,
        data: {
          systems: [
            { id:'meihua', name:'梅花易数', description:'时间/数字/铜钱起卦，体用生克分析' },
            { id:'liuyao', name:'六爻纳甲', description:'铜钱/数字/时间起卦，本卦变卦六亲六神' },
            { id:'bazi', name:'八字命理', description:'四柱干支、五行强弱、大运流年、喜用神' },
            { id:'qimen', name:'奇门遁甲', description:'九宫飞星、八门八神、格局检测' },
            { id:'ziwei', name:'紫微斗数', description:'十二宫、十四主星、运势预测' }
          ]
        }
      });
      return;
    }

    // === 梅花易数 ===
    if (path === '/api/meihua/divinate') {
      const method = url.searchParams.get('method') || 'time';
      const engine = new MeihuaEngine();
      let result;

      if (method === 'number') {
        const n1 = parseInt(url.searchParams.get('n1') || '1');
        const n2 = parseInt(url.searchParams.get('n2') || '2');
        const n3 = url.searchParams.get('n3');
        result = engine.divinateByNumber(n1, n2, n3 ? parseInt(n3) : undefined);
      } else if (method === 'random') {
        result = engine.divinateByRandom();
      } else {
        result = engine.divinateByTime();
      }

      json(res, 200, { success: true, data: result });
      return;
    }

    // === 六爻 ===
    if (path === '/api/liuyao/divinate') {
      const method = url.searchParams.get('method') || 'time';
      const engine = new LiuYaoEngine();
      let result;

      if (method === 'number') {
        const n1 = parseInt(url.searchParams.get('n1') || '1');
        const n2 = parseInt(url.searchParams.get('n2') || '2');
        const n3 = parseInt(url.searchParams.get('n3') || '3');
        const n4 = parseInt(url.searchParams.get('n4') || '4');
        const n5 = parseInt(url.searchParams.get('n5') || '5');
        const n6 = parseInt(url.searchParams.get('n6') || '6');
        result = engine.divinateByNumber(n1, n2, n3, n4, n5, n6);
      } else if (method === 'coin') {
        const rolls = Array.from({length:6}, () => [6,7,8,9][Math.floor(Math.random()*4)]);
        result = engine.divinateByCoin(rolls);
      } else {
        result = engine.divinateByTime();
      }

      json(res, 200, { success: true, data: result });
      return;
    }

    // === 八字 ===
    if (path === '/api/bazi/calculate') {
      const year = parseInt(url.searchParams.get('year') || String(new Date().getFullYear()));
      const month = parseInt(url.searchParams.get('month') || String(new Date().getMonth()+1));
      const day = parseInt(url.searchParams.get('day') || String(new Date().getDate()));
      const gender = (url.searchParams.get('gender') || 'male') as 'male' | 'female';

      const engine = new BaZiEngine();
      const result = engine.calculate(new Date(year, month-1, day), gender);

      json(res, 200, { success: true, data: result });
      return;
    }

    // === 奇门 ===
    if (path === '/api/qimen/layout') {
      const engine = new QimenEngine();
      const result = engine.calculate(new Date());
      json(res, 200, { success: true, data: result });
      return;
    }

    // === 紫微 ===
    if (path === '/api/ziwei/layout') {
      const year = parseInt(url.searchParams.get('year') || String(new Date().getFullYear()));
      const month = parseInt(url.searchParams.get('month') || String(new Date().getMonth()+1));
      const day = parseInt(url.searchParams.get('day') || String(new Date().getDate()));
      const gender = (url.searchParams.get('gender') || '男') as '男' | '女';

      const engine = new ZiweiEngine();
      const result = engine.calculate(new Date(year, month-1, day), gender);

      json(res, 200, { success: true, data: result });
      return;
    }

    // === 404 ===
    json(res, 404, { success: false, error: `Not Found: ${path}` });

  } catch (e: any) {
    json(res, 500, { success: false, error: e.message || String(e) });
  }
});

server.listen(PORT, () => {
  console.log(`\n  天问后端服务已启动: http://localhost:${PORT}`);
  console.log(`  梅花易数: http://localhost:${PORT}/api/meihua/divinate`);
  console.log(`  六爻:     http://localhost:${PORT}/api/liuyao/divinate`);
  console.log(`  八字:     http://localhost:${PORT}/api/bazi/calculate?year=1990&month=1&day=1&gender=male`);
  console.log(`  奇门:     http://localhost:${PORT}/api/qimen/layout`);
  console.log(`  紫微:     http://localhost:${PORT}/api/ziwei/layout?year=1990&month=1&day=1\n`);
});