/**
 * Execution Graph - DAG执行引擎
 */

import {
  ExecutionNode,
  ExecutionContext,
  ExecutionResult,
  GraphExecutionResult,
  GraphSnapshot,
  NodeStatus,
} from './types';

export class ExecutionGraph {
  private nodes: Map<string, ExecutionNode> = new Map();
  private adjacencyList: Map<string, Set<string>> = new Map();
  private reverseAdjacencyList: Map<string, Set<string>> = new Map();

  constructor() {}

  addNode(node: ExecutionNode): void {
    this.nodes.set(node.id, node);
    this.adjacencyList.set(node.id, new Set());
    this.reverseAdjacencyList.set(node.id, new Set());
  }

  addEdge(fromId: string, toId: string): void {
    this.adjacencyList.get(fromId)?.add(toId);
    this.reverseAdjacencyList.get(toId)?.add(fromId);
  }

  async execute(initialContext: ExecutionContext = {}): Promise<GraphExecutionResult> {
    const startTime = performance.now();
    const results = new Map<string, ExecutionResult>();
    const context = { ...initialContext };
    const executionOrder = this.topologicalSort();

    for (const nodeId of executionOrder) {
      const node = this.nodes.get(nodeId)!;
      const nodeStartTime = performance.now();

      try {
        if (node.shouldExecute && !node.shouldExecute(context)) {
          results.set(nodeId, {
            nodeId,
            status: 'skipped',
            duration: 0,
            timestamp: Date.now(),
          });
          continue;
        }

        for (const depId of node.dependencies) {
          const depResult = results.get(depId);
          if (!depResult || depResult.status !== 'completed') {
            results.set(nodeId, {
              nodeId,
              status: 'skipped',
              error: `Dependency ${depId} not satisfied`,
              duration: 0,
              timestamp: Date.now(),
            });
            continue;
          }
        }

        results.set(nodeId, {
          nodeId,
          status: 'running',
          duration: 0,
          timestamp: Date.now(),
        });

        const result = await node.execute(context);
        
        results.set(nodeId, {
          nodeId,
          status: 'completed',
          result,
          duration: performance.now() - nodeStartTime,
          timestamp: Date.now(),
        });
      } catch (error) {
        results.set(nodeId, {
          nodeId,
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
          duration: performance.now() - nodeStartTime,
          timestamp: Date.now(),
        });
      }
    }

    return {
      success: Array.from(results.values()).every(r => r.status !== 'failed'),
      results,
      duration: performance.now() - startTime,
      finalContext: context,
    };
  }

  topologicalSort(): string[] {
    const visited = new Set<string>();
    const stack: string[] = [];

    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      for (const depId of this.reverseAdjacencyList.get(nodeId) || []) {
        visit(depId);
      }

      stack.push(nodeId);
    };

    for (const nodeId of this.nodes.keys()) {
      visit(nodeId);
    }

    return stack;
  }

  getDirtyNodes(previousSnapshot?: GraphSnapshot): Set<string> {
    if (!previousSnapshot) {
      return new Set(this.nodes.keys());
    }

    const dirty = new Set<string>();
    for (const nodeId of this.nodes.keys()) {
      const node = this.nodes.get(nodeId)!;
      const prevResult = previousSnapshot.results.find(r => r.nodeId === nodeId);
      
      if (!prevResult || prevResult.status === 'failed') {
        dirty.add(nodeId);
        continue;
      }

      if (node.shouldExecute && !node.shouldExecute(previousSnapshot.context)) {
        continue;
      }

      dirty.add(nodeId);
    }

    for (const nodeId of dirty) {
      for (const dependent of this.adjacencyList.get(nodeId) || []) {
        if (dirty.has(nodeId)) {
          dirty.add(dependent);
        }
      }
    }

    return dirty;
  }

  async incrementalExecute(
    previousSnapshot?: GraphSnapshot,
    initialContext: ExecutionContext = {}
  ): Promise<GraphExecutionResult> {
    const dirtyNodes = this.getDirtyNodes(previousSnapshot);
    const startTime = performance.now();
    const results = new Map<string, ExecutionResult>();
    const context = previousSnapshot 
      ? { ...previousSnapshot.context, ...initialContext }
      : { ...initialContext };

    const executionOrder = this.topologicalSort().filter(id => dirtyNodes.has(id));

    for (const nodeId of executionOrder) {
      const node = this.nodes.get(nodeId)!;
      const nodeStartTime = performance.now();

      try {
        for (const depId of node.dependencies) {
          if (dirtyNodes.has(depId)) {
            const depResult = results.get(depId);
            if (!depResult || depResult.status !== 'completed') {
              results.set(nodeId, {
                nodeId,
                status: 'skipped',
                error: `Dirty dependency ${depId} not satisfied`,
                duration: 0,
                timestamp: Date.now(),
              });
              continue;
            }
          }
        }

        results.set(nodeId, {
          nodeId,
          status: 'running',
          duration: 0,
          timestamp: Date.now(),
        });

        const result = await node.execute(context);

        results.set(nodeId, {
          nodeId,
          status: 'completed',
          result,
          duration: performance.now() - nodeStartTime,
          timestamp: Date.now(),
        });
      } catch (error) {
        results.set(nodeId, {
          nodeId,
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
          duration: performance.now() - nodeStartTime,
          timestamp: Date.now(),
        });
      }
    }

    return {
      success: Array.from(results.values()).every(r => r.status !== 'failed'),
      results,
      duration: performance.now() - startTime,
      finalContext: context,
    };
  }

  createSnapshot(executionId: string, results: Map<string, ExecutionResult>, context: ExecutionContext): GraphSnapshot {
    return {
      executionId,
      timestamp: Date.now(),
      results: Array.from(results.entries()).map(([nodeId, result]) => ({
        nodeId,
        ...result,
      })),
      context: { ...context },
    };
  }

  getNode(nodeId: string): ExecutionNode | undefined {
    return this.nodes.get(nodeId);
  }

  getAllNodes(): ExecutionNode[] {
    return Array.from(this.nodes.values());
  }

  visualize(): { nodes: string[]; edges: Array<[string, string]> } {
    const edges: Array<[string, string]> = [];
    
    for (const [fromId, toSet] of this.adjacencyList.entries()) {
      for (const toId of toSet) {
        edges.push([fromId, toId]);
      }
    }

    return {
      nodes: Array.from(this.nodes.keys()),
      edges,
    };
  }
}
