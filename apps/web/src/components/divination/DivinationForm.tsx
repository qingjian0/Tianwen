'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, RoyalButton } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface DivinationFormProps {
  onSubmit: (data: FormData) => void;
}

interface FormData {
  time: string;
  location: string;
  method: string;
  number1: string;
  number2: string;
  number3: string;
  advanced: {
    switchGeneral: string;
    zhongqi: boolean;
    dayNight: string;
    harmMethod: string;
  };
}

const divinationMethods = [
  { id: 'dice', name: '骰子', icon: '🎲', desc: '随机起卦' },
  { id: 'number', name: '报数', icon: '🔢', desc: '输入数字' },
  { id: 'double', name: '双数', icon: '⚖️', desc: '两个数字' },
  { id: 'random', name: '随机', icon: '✨', desc: '系统随机' },
];

export const DivinationForm = ({ onSubmit }: DivinationFormProps) => {
  const [method, setMethod] = useState('dice');
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [number3, setNumber3] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedValues, setAdvancedValues] = useState({
    switchGeneral: 'day',
    zhongqi: false,
    dayNight: 'day',
    harmMethod: 'standard',
  });
  const [isShaking, setIsShaking] = useState(false);

  const handleDiceRoll = () => {
    setIsShaking(true);
    setTimeout(() => {
      const n1 = Math.floor(Math.random() * 9) + 1;
      const n2 = Math.floor(Math.random() * 9) + 1;
      const n3 = Math.floor(Math.random() * 6) + 1;
      setNumber1(n1.toString());
      setNumber2(n2.toString());
      setNumber3(n3.toString());
      setIsShaking(false);
    }, 800);
  };

  const handleSubmit = () => {
    onSubmit({
      time: new Date().toISOString(),
      location: '',
      method,
      number1,
      number2,
      number3,
      advanced: advancedValues,
    });
  };

  return (
    <div className="space-y-6">
      <Card variant="default">
        <h3 className="font-song text-lg font-bold text-text-primary mb-4">起卦方式</h3>
        <div className="grid grid-cols-2 gap-3">
          {divinationMethods.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setMethod(item.id)}
              className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                method === item.id
                  ? 'border-gold bg-gold/10 shadow-gold-glow text-gold'
                  : 'border-border bg-bg-medium text-text-secondary hover:border-gold/50 hover:bg-bg-light hover:text-gold hover:shadow-gold-glow/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <div className="text-left">
                  <div className="font-kai text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-text-muted mt-0.5">{item.desc}</div>
                </div>
              </div>
              {method === item.id && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold animate-pulse" />
              )}
            </motion.button>
          ))}
        </div>
      </Card>

      <Card variant="default">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-song text-lg font-bold text-text-primary">起卦参数</h3>
          {method === 'dice' && (
            <RoyalButton
              size="sm"
              onClick={handleDiceRoll}
              className={isShaking ? 'animate-shake' : ''}
            >
              🎲 摇卦
            </RoyalButton>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { value: number1, setValue: setNumber1, label: '上卦', placeholder: '1-9', max: '9' },
            { value: number2, setValue: setNumber2, label: '下卦', placeholder: '1-9', max: '9' },
            { value: number3, setValue: setNumber3, label: '动爻', placeholder: '1-6', max: '6' },
          ].map((field, idx) => (
            <motion.div
              key={idx}
              className="space-y-2"
              animate={isShaking ? { x: [-3, 3, -3, 3, 0] } : {}}
              transition={{ duration: 0.1 }}
            >
              <Input
                label={field.label}
                type="number"
                min="1"
                max={field.max}
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                placeholder={field.placeholder}
                inputSize="lg"
              />
            </motion.div>
          ))}
        </div>
      </Card>

      <Card variant="plain">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-left hover:text-gold transition-colors"
        >
          <span className="font-kai text-text-secondary">高级参数</span>
          <motion.span
            animate={{ rotate: showAdvanced ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-text-muted"
          >
            ▼
          </motion.span>
        </button>
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-muted font-kai mb-2 block">换将</label>
                    <select
                      value={advancedValues.switchGeneral}
                      onChange={(e) =>
                        setAdvancedValues({ ...advancedValues, switchGeneral: e.target.value })
                      }
                      className="w-full px-3 py-2.5 bg-bg-medium border border-border rounded-lg text-text-primary focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="day">日将</option>
                      <option value="night">夜将</option>
                      <option value="sun">太阳将</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted font-kai mb-2 block">中气</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={advancedValues.zhongqi}
                        onChange={(e) =>
                          setAdvancedValues({ ...advancedValues, zhongqi: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-border bg-bg-medium text-gold focus:ring-gold"
                      />
                      <span className="text-sm text-text-secondary">启用中气</span>
                    </label>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted font-kai mb-2 block">昼夜</label>
                    <select
                      value={advancedValues.dayNight}
                      onChange={(e) =>
                        setAdvancedValues({ ...advancedValues, dayNight: e.target.value })
                      }
                      className="w-full px-3 py-2.5 bg-bg-medium border border-border rounded-lg text-text-primary focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="day">昼</option>
                      <option value="night">夜</option>
                      <option value="auto">自动</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted font-kai mb-2 block">涉害方式</label>
                    <select
                      value={advancedValues.harmMethod}
                      onChange={(e) =>
                        setAdvancedValues({ ...advancedValues, harmMethod: e.target.value })
                      }
                      className="w-full px-3 py-2.5 bg-bg-medium border border-border rounded-lg text-text-primary focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="standard">标准</option>
                      <option value="special">特殊</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <RoyalButton
        size="lg"
        onClick={handleSubmit}
        className="w-full animate-pulse-gold"
        disabled={!number1 || !number2 || !number3}
      >
        🔮 排盘
      </RoyalButton>
    </div>
  );
};
