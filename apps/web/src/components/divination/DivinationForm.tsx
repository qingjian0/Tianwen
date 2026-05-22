'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  { id: 'dice', name: '骰子摇卦', icon: '🎲', desc: '随机起卦' },
  { id: 'number', name: '报数起卦', icon: '🔢', desc: '输入数字' },
  { id: 'double', name: '双数起卦', icon: '⚖️', desc: '两个数字' },
  { id: 'random', name: '随机起卦', icon: '✨', desc: '系统随机' },
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
      <div className="bg-bg-card border border-border rounded-sm p-5 shadow-card">
        <h3 className="font-song text-lg font-bold text-text-primary mb-4">起卦方式</h3>
        <div className="grid grid-cols-2 gap-3">
          {divinationMethods.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setMethod(item.id)}
              className={`relative p-4 rounded-sm border transition-all duration-200 ${
                method === item.id
                  ? 'border-primary bg-primary/10 text-primary-light'
                  : 'border-border bg-bg-medium text-text-secondary hover:border-border-light hover:text-text-primary'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div className="text-left">
                  <div className="font-kai">{item.name}</div>
                  <div className="text-xs text-text-muted">{item.desc}</div>
                </div>
              </div>
              {method === item.id && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-sm p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-song text-lg font-bold text-text-primary">起卦参数</h3>
          {method === 'dice' && (
            <motion.button
              onClick={handleDiceRoll}
              className="px-4 py-2 bg-gradient-primary text-white rounded-sm font-kai text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              摇卦
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { value: number1, setValue: setNumber1, label: '上卦', placeholder: '1-9' },
            { value: number2, setValue: setNumber2, label: '下卦', placeholder: '1-9' },
            { value: number3, setValue: setNumber3, label: '动爻', placeholder: '1-6' },
          ].map((field, idx) => (
            <div key={idx} className="space-y-2">
              <label className="text-xs text-text-muted font-kai">{field.label}</label>
              <motion.div
                animate={isShaking ? { x: [-3, 3, -3, 3, 0] } : {}}
                transition={{ duration: 0.1 }}
              >
                <input
                  type="number"
                  min="1"
                  max={idx === 2 ? '6' : '9'}
                  value={field.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-3 bg-bg-medium border border-border rounded-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-sm shadow-card overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-bg-medium transition-colors"
        >
          <span className="font-kai text-text-secondary">高级参数</span>
          <motion.span
            animate={{ rotate: showAdvanced ? 180 : 0 }}
            transition={{ duration: 0.2 }}
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
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-muted font-kai mb-2 block">换将</label>
                    <select
                      value={advancedValues.switchGeneral}
                      onChange={(e) =>
                        setAdvancedValues({ ...advancedValues, switchGeneral: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-bg-medium border border-border rounded-sm text-text-primary focus:outline-none focus:border-primary"
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
                        className="w-4 h-4 rounded border-border bg-bg-medium text-primary focus:ring-primary"
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
                      className="w-full px-3 py-2 bg-bg-medium border border-border rounded-sm text-text-primary focus:outline-none focus:border-primary"
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
                      className="w-full px-3 py-2 bg-bg-medium border border-border rounded-sm text-text-primary focus:outline-none focus:border-primary"
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
      </div>

      <motion.button
        onClick={handleSubmit}
        className="w-full py-4 bg-gradient-primary text-white font-song text-lg rounded-sm animate-pulse-gold"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={!number1 || !number2 || !number3}
      >
        排盘
      </motion.button>
    </div>
  );
};
