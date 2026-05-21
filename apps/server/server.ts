/**
 * 天问 - 真实后端服务
 * 直接连接所有术数引擎，提供 REST API
 */

import http from 'http';
import crypto from 'crypto';
import { MeihuaEngine } from '@tianwen/meihua';
import { BaZiEngine } from '@tianwen/bazi-engine';
import { LiuYaoEngine } from '@tianwen/liuyao';
import { QimenEngine } from '@tianwen/qimen';
import { ZiweiEngine } from '@tianwen/ziwei';
import { LiuRenEngine } from '@tianwen/liuren';
import { XiaoChengTuEngine } from '@tianwen/xiaochengtu';
import { HuangLiEngine } from '@tianwen/huangli';
import { HuangJiEngine } from '@tianwen/huangji';
import { CeGuiEngine } from '@tianwen/cegui';
import { TianwenPipeline, PredictionInput } from '@tianwen/pipeline';

const PORT = parseInt(process.env.PORT || '4000');

const pipeline = new TianwenPipeline({
  enableCache: false,
  enableConflictResolution: true,
  enableMultiSystemFusion: false,
  maxExecutionTimeMs: 30000,
  stages: [
    { name: 'input', enabled: true },
    { name: 'random', enabled: true },
    { name: 'chrono', enabled: true },
    { name: 'divination', enabled: true },
    { name: 'signal', enabled: true },
    { name: 'rule', enabled: true },
    { name: 'conflict', enabled: true },
    { name: 'probability', enabled: true },
    { name: 'fortune', enabled: true },
    { name: 'timing', enabled: true },
    { name: 'interpretation', enabled: true },
    { name: 'output', enabled: true }
  ],
  rules: { enabled: true },
  interpretation: { enabled: true, style: 'detailed', includeTrace: true }
});

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
        data: { status: 'healthy', uptime: process.uptime(), engines: ['meihua','liuyao','bazi','qimen','ziwei','liuren','xiaochengtu','huangli','huangji','cegui'] }
      });
      return;
    }

    if (path === '/api/random') {
      const count = parseInt(url.searchParams.get('count') || '3');
      const min = parseInt(url.searchParams.get('min') || '1');
      const max = parseInt(url.searchParams.get('max') || '100');
      const seed = url.searchParams.get('seed') || crypto.randomUUID();

      const numbers: number[] = [];
      for (let i = 0; i < Math.min(count, 20); i++) {
        const buf = crypto.randomBytes(4);
        const val = buf.readUInt32BE(0);
        numbers.push(min + (val % (max - min + 1)));
      }

      json(res, 200, {
        success: true,
        data: {
          numbers,
          seed,
          timestamp: new Date().toISOString(),
          count,
          range: { min, max }
        }
      });
      return;
    }

    if (path === '/api/systems') {
      json(res, 200, {
        success: true,
        data: {
          systems: [
            { id:'meihua', name:'梅花易数', description:'时间/数字/铜钱起卦，体用生克分析', inputMode: 'random|time' },
            { id:'liuyao', name:'六爻纳甲', description:'铜钱/数字/时间起卦，本卦变卦六亲六神', inputMode: 'random|time' },
            { id:'bazi', name:'八字命理', description:'四柱干支、五行强弱、大运流年、喜用神', inputMode: 'birth' },
            { id:'qimen', name:'奇门遁甲', description:'九宫飞星、八门八神、格局检测', inputMode: 'time' },
            { id:'ziwei', name:'紫微斗数', description:'十二宫、十四主星、运势预测', inputMode: 'birth' },
            { id:'liuren', name:'大六壬', description:'月将加时、天地盘、四课三传', inputMode: 'eventTime' },
            { id:'xiaochengtu', name:'小成图', description:'归藏法起卦、九宫排列、主客分析', inputMode: 'random|time' },
            { id:'huangli', name:'老黄历', description:'每日宜忌、冲煞吉神、农历查询', inputMode: 'date' },
            { id:'huangji', name:'皇极经世', description:'元会运世、卦命推演、时间周期', inputMode: 'birth' },
            { id:'cegui', name:'策轨数', description:'动植数计算、卦轨推演', inputMode: 'birth' }
          ]
        }
      });
      return;
    }

    // === 统一预测接口（Pipeline）===
    if (path === '/api/predict' && req.method === 'POST') {
      const body = await parseBody(req);

      const systemField = body.system || 'meihua';
      const systems: any[] = Array.isArray(systemField) ? systemField : [systemField];

      const input: PredictionInput = {
        question: body.question || '无特定问题',
        category: body.category || 'general',
        systems,
        mode: body.mode || 'single',
        timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
        birth: body.birth || body.birthInfo || undefined,
        eventTime: body.eventTime || undefined,
        randomSource: body.randomSource || undefined,
        location: body.location || undefined,
        systemConfig: body.systemConfig || undefined
      };

      const result = await pipeline.execute(input);

      json(res, 200, {
        success: result.success,
        data: {
          summary: result.output.summary,
          probability: result.output.probability,
          fortune: result.output.fortune,
          signals: result.output.signals,
          appliedRules: result.output.appliedRules,
          knowledgeReferences: result.output.knowledgeReferences,
          actionableSuggestions: result.output.actionableSuggestions,
          calculationTrace: result.output.calculationTrace,
          warnings: result.warnings,
          errors: result.errors
        }
      });
      return;
    }

    if (path === '/api/predict' && req.method === 'GET') {
      const question = url.searchParams.get('question') || '今日运势';
      const category = url.searchParams.get('category') || 'general';
      const systemStr = url.searchParams.get('system') || 'meihua';
      const systems = systemStr.split(',').filter(Boolean) as any[];
      const mode = url.searchParams.get('mode') || 'single';

      const year = url.searchParams.get('year');
      const month = url.searchParams.get('month');
      const day = url.searchParams.get('day');
      const hour = url.searchParams.get('hour');

      const input: PredictionInput = {
        question,
        category,
        systems,
        mode: mode as any,
        timestamp: new Date(),
        birth: (year && month && day) ? {
          year: parseInt(year),
          month: parseInt(month),
          day: parseInt(day),
          hour: parseInt(hour || '0'),
          gender: (url.searchParams.get('gender') || 'male') as 'male' | 'female',
          calendar: (url.searchParams.get('calendar') || 'solar') as 'solar' | 'lunar'
        } : undefined
      };

      const result = await pipeline.execute(input);

      json(res, 200, {
        success: result.success,
        data: {
          summary: result.output.summary,
          probability: result.output.probability,
          fortune: result.output.fortune,
          signals: result.output.signals,
          appliedRules: result.output.appliedRules,
          knowledgeReferences: result.output.knowledgeReferences,
          actionableSuggestions: result.output.actionableSuggestions,
          calculationTrace: result.output.calculationTrace,
          warnings: result.warnings,
          errors: result.errors
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

    // === 大六壬 ===
    if (path === '/api/liuren/calculate') {
      const year = parseInt(url.searchParams.get('year') || String(new Date().getFullYear()));
      const month = parseInt(url.searchParams.get('month') || String(new Date().getMonth()+1));
      const day = parseInt(url.searchParams.get('day') || String(new Date().getDate()));
      const hour = parseInt(url.searchParams.get('hour') || String(new Date().getHours()));

      const engine = new LiuRenEngine();
      const result = engine.calculate({
        eventTime: { year, month, day, hour }
      });

      json(res, 200, { success: true, data: result });
      return;
    }

    // === 小成图 ===
    if (path === '/api/xiaochengtu/calculate') {
      const n1 = url.searchParams.get('n1');
      const n2 = url.searchParams.get('n2');
      const n3 = url.searchParams.get('n3');

      const engine = new XiaoChengTuEngine();
      const result = n1 && n2 && n3
        ? engine.calculate({ numbers: [parseInt(n1), parseInt(n2), parseInt(n3)] })
        : engine.calculate({ date: new Date() });

      json(res, 200, { success: true, data: result });
      return;
    }

    // === 老黄历 ===
    if (path === '/api/huangli') {
      const year = url.searchParams.get('year');
      const month = url.searchParams.get('month');
      const day = url.searchParams.get('day');

      const engine = new HuangLiEngine();
      const result = (year && month && day)
        ? engine.queryByDate(parseInt(year), parseInt(month), parseInt(day))
        : engine.query();

      json(res, 200, { success: true, data: result });
      return;
    }

    // === 皇极经世 ===
    if (path === '/api/huangji/calculate') {
      const year = parseInt(url.searchParams.get('year') || String(new Date().getFullYear()));
      const month = parseInt(url.searchParams.get('month') || String(new Date().getMonth()+1));
      const day = parseInt(url.searchParams.get('day') || String(new Date().getDate()));
      const hour = parseInt(url.searchParams.get('hour') || '0');

      const engine = new HuangJiEngine();
      const result = engine.calculate({ year, month, day, hour });

      json(res, 200, { success: true, data: result });
      return;
    }

    // === 策轨数 ===
    if (path === '/api/cegui/calculate') {
      const year = parseInt(url.searchParams.get('year') || String(new Date().getFullYear()));
      const month = parseInt(url.searchParams.get('month') || String(new Date().getMonth()+1));
      const day = parseInt(url.searchParams.get('day') || String(new Date().getDate()));
      const hour = parseInt(url.searchParams.get('hour') || '0');

      const engine = new CeGuiEngine();
      const result = engine.calculate({ year, month, day, hour });

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
  console.log(`  Pipeline:  http://localhost:${PORT}/api/predict?question=今日运势&system=meihua`);
  console.log(`  梅花易数:  http://localhost:${PORT}/api/meihua/divinate`);
  console.log(`  六爻:      http://localhost:${PORT}/api/liuyao/divinate`);
  console.log(`  八字:      http://localhost:${PORT}/api/bazi/calculate?year=1990&month=1&day=1&gender=male`);
  console.log(`  奇门:      http://localhost:${PORT}/api/qimen/layout`);
  console.log(`  紫微:      http://localhost:${PORT}/api/ziwei/layout?year=1990&month=1&day=1\n`);
});