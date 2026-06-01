# 天问 — AI 易学命理分析与推理系统

> 基于古籍经典的 AI 易学命理智能推理系统

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&amp;logo=python)
![LLM](https://img.shields.io/badge/LLM-推理-FF6F00?style=flat-square)
![国学](https://img.shields.io/badge/国学-AI融合-8E24AA?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## 项目简介

天问（Tianwen）是一个基于大语言模型（LLM）的 AI 易学命理分析与推理系统。项目灵感源于屈原《天问》——以"问天"之姿，借助 AI 技术探索中国古典命理学的智慧。

系统以《易经》、《三命通会》、《渊海子平》等古籍经典为知识基础，结合现代 LLM 的自然语言理解与推理能力，实现智能化命理分析。

## 核心功能

### 八卦推演
- 基于六十四卦的自动推演
- 卦象互变关系分析
- 卦辞解读与上下文关联

### 四柱八字分析
- 生辰八字自动计算
- 五行生克制化分析
- 十神定位与解说
- 大运流年推算

### 古籍知识库
- 《易经》六十四卦原文及注解
- 《三命通会》命理规则
- 《渊海子平》八字理论

## 技术架构

| 组件 | 技术选型 | 说明 |
|------|---------|------|
| LLM | GPT-4 / Claude | 主推理引擎 |
| RAG | LangChain + ChromaDB | 古籍知识检索 |
| 命理计算 | 自研规则引擎 | 八字、卦象计算 |

## 快速开始

```bash
git clone https://github.com/qingjian0/Tianwen.git
cd Tianwen
pip install -r requirements.txt
export OPENAI_API_KEY="sk-xxx"
python app.py
```

## 免责声明

本系统仅供研究学习和文化传承目的。命理分析结果不应作为决策的唯一依据。

## 许可证

MIT License

---

⭐ 如果这个项目对你有帮助，请给一个 Star！