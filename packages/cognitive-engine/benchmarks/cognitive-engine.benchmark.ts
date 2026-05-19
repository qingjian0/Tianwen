/**
 * Cognitive Engine Benchmark
 */

import { CognitiveEngine } from '../src/cognitive-engine';

async function runBenchmark() {
  console.log('=== Cognitive Engine Benchmark ===\n');

  const engine = new CognitiveEngine();
  const iterations = 100;

  console.log(`Running ${iterations} iterations...\n`);

  const startTime = performance.now();
  const results: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const iterStart = performance.now();

    const context = {
      input: { timestamp: Date.now(), iteration: i },
      signals: [
        { type: 'wuxing', wuxing: '木', weight: 0.8 + Math.random() * 0.2 },
        { type: 'wuxing', wuxing: '火', weight: 0.7 + Math.random() * 0.2 },
        { type: 'wuxing', wuxing: '土', weight: 0.6 + Math.random() * 0.2 },
        { type: 'ganzhi', tiangan: '甲', weight: 0.75 },
        { type: 'ganzhi', dizhi: '寅', weight: 0.7 },
      ],
      rules: Array.from({ length: 5 }, (_, idx) => ({ id: `rule_${idx}` })),
    };

    const result = await engine.execute(context);
    results.push(performance.now() - iterStart);
  }

  const totalTime = performance.now() - startTime;

  const avgTime = results.reduce((a, b) => a + b, 0) / results.length;
  const minTime = Math.min(...results);
  const maxTime = Math.max(...results);
  const p95Time = results.sort((a, b) => a - b)[Math.floor(iterations * 0.95)];

  console.log('Results:');
  console.log(`  Total Time: ${totalTime.toFixed(2)} ms`);
  console.log(`  Average: ${avgTime.toFixed(2)} ms`);
  console.log(`  Min: ${minTime.toFixed(2)} ms`);
  console.log(`  Max: ${maxTime.toFixed(2)} ms`);
  console.log(`  P95: ${p95Time.toFixed(2)} ms`);
  console.log(`  Throughput: ${(iterations / (totalTime / 1000)).toFixed(2)} ops/sec`);
  console.log('\nThroughput Test Complete');
}

runBenchmark().catch(console.error);
