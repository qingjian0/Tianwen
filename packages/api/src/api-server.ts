/**
 * API 路由 - HTTP 端点定义
 */

import { Router, Request, Response } from 'express';
import { PredictionService } from './prediction-service';
import { RuleService } from './rule-service';
import { PredictionRequest, RuleQuery } from './types';

export function createApiRouter(): Router {
  const router = Router();
  const predictionService = new PredictionService();
  const ruleService = new RuleService();

  router.get('/health', async (req: Request, res: Response) => {
    const result = await predictionService.healthCheck();
    res.json(result);
  });

  router.post('/predictions', async (req: Request, res: Response) => {
    const request: PredictionRequest = req.body;
    
    if (!request.question || !request.category || !request.system) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: question, category, system',
        timestamp: new Date().toISOString(),
        requestId: 'error'
      });
    }

    const result = await predictionService.predict(request);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(500).json(result);
    }
  });

  router.get('/predictions/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await predictionService.getPrediction(id);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  });

  router.get('/predictions', async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const result = await predictionService.getHistory(page, limit);
    res.json(result);
  });

  router.get('/rules', async (req: Request, res: Response) => {
    const query: RuleQuery = {
      category: req.query.category as string,
      priority: req.query.priority as string,
      keyword: req.query.keyword as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20
    };
    
    const result = await ruleService.getRules(query);
    res.json(result);
  });

  router.get('/rules/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ruleService.getRuleById(id);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  });

  router.get('/rules/categories/list', async (req: Request, res: Response) => {
    const result = await ruleService.getCategories();
    res.json(result);
  });

  router.get('/rules/categories/:category', async (req: Request, res: Response) => {
    const { category } = req.params;
    const result = await ruleService.getRulesByCategory(category);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  });

  return router;
}
