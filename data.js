// 攀岩缝型分类（trad 常用术语，边界以 mm 近似）
window.CRACK_TYPES = [
  { key: 'tips',      name: '指尖缝', en: 'Tips',        min: 0,   max: 20,  color: '#06B6D4', desc: '仅指尖能插入,极薄缝,需技术好的手指锁点' },
  { key: 'fingers',   name: '指缝',   en: 'Fingers',     min: 20,  max: 30,  color: '#3B82F6', desc: '手指第一/二指节能塞入,小号 cam 主战场' },
  { key: 'thinhands', name: '薄手缝', en: 'Thin Hands',  min: 30,  max: 40,  color: '#8B5CF6', desc: '手指加部分手掌,介于指与手之间的尴尬尺寸' },
  { key: 'hands',     name: '手缝',   en: 'Hands',       min: 40,  max: 60,  color: '#10B981', desc: '整只手掌能塞入并锁紧,最舒服的缝型' },
  { key: 'fist',      name: '拳缝',   en: 'Fist',        min: 60,  max: 90,  color: '#F59E0B', desc: '握拳能卡住,中号 cam 和大 nut 区间' },
  { key: 'ow',        name: '宽缝',   en: 'Off-width',   min: 90,  max: 200, color: '#EF4444', desc: '比拳大,比身体小,最难攀登的缝型' },
  { key: 'chimney',   name: '烟囱',   en: 'Chimney',     min: 200, max: 400, color: '#6B7280', desc: '整个身体可进入,用背撑/膝顶技术' },
];

// 机械塞数据 — 单位：mm，以厂商标称为准
// 色标字段 colorHex 用于条形图着色（近似厂商色标）
window.CAM_DATA = [
  // ===== BD Camalot C4 =====
  { brand: 'BD C4', size: '0.3',  colorName: '绿', colorHex: '#22C55E', min: 13.8, max: 23.4 },
  { brand: 'BD C4', size: '0.4',  colorName: '灰', colorHex: '#9CA3AF', min: 15.5, max: 26.7 },
  { brand: 'BD C4', size: '0.5',  colorName: '紫', colorHex: '#8B5CF6', min: 19.6, max: 33.8 },
  { brand: 'BD C4', size: '0.75', colorName: '绿', colorHex: '#16A34A', min: 23.9, max: 41.2 },
  { brand: 'BD C4', size: '1',    colorName: '红', colorHex: '#DC2626', min: 30.2, max: 52.1 },
  { brand: 'BD C4', size: '2',    colorName: '黄', colorHex: '#EAB308', min: 37.2, max: 64.9 },
  { brand: 'BD C4', size: '3',    colorName: '蓝', colorHex: '#2563EB', min: 50.7, max: 87.9 },
  { brand: 'BD C4', size: '4',    colorName: '灰', colorHex: '#6B7280', min: 66.0, max: 114.7 },
  { brand: 'BD C4', size: '5',    colorName: '紫', colorHex: '#7C3AED', min: 85.4, max: 148.5 },
  { brand: 'BD C4', size: '6',    colorName: '绿', colorHex: '#15803D', min: 114.1, max: 195.0 },
  { brand: 'BD C4', size: '7',    colorName: '红', colorHex: '#B91C1C', min: 149.9, max: 253.4 },
  { brand: 'BD C4', size: '8',    colorName: '黄', colorHex: '#CA8A04', min: 194.8, max: 321.1 },

  // ===== BD Z4 =====
  { brand: 'BD Z4', size: '0',    colorName: '紫', colorHex: '#A855F7', min: 7.5,  max: 11.8 },
  { brand: 'BD Z4', size: '0.1',  colorName: '红', colorHex: '#EF4444', min: 8.8,  max: 13.8 },
  { brand: 'BD Z4', size: '0.2',  colorName: '黄', colorHex: '#FACC15', min: 9.9,  max: 16.5 },
  { brand: 'BD Z4', size: '0.3',  colorName: '蓝', colorHex: '#3B82F6', min: 12.4, max: 22.6 },
  { brand: 'BD Z4', size: '0.4',  colorName: '灰', colorHex: '#9CA3AF', min: 15.5, max: 26.7 },
  { brand: 'BD Z4', size: '0.5',  colorName: '紫', colorHex: '#8B5CF6', min: 19.6, max: 33.8 },
  { brand: 'BD Z4', size: '0.75', colorName: '绿', colorHex: '#16A34A', min: 23.9, max: 41.2 },

  // ===== DMM Dragon =====
  { brand: 'DMM Dragon', size: '00', colorName: '蓝', colorHex: '#3B82F6', min: 14, max: 21 },
  { brand: 'DMM Dragon', size: '0',  colorName: '银', colorHex: '#D1D5DB', min: 16, max: 25 },
  { brand: 'DMM Dragon', size: '1',  colorName: '紫', colorHex: '#8B5CF6', min: 20, max: 33 },
  { brand: 'DMM Dragon', size: '2',  colorName: '绿', colorHex: '#16A34A', min: 24, max: 41 },
  { brand: 'DMM Dragon', size: '3',  colorName: '红', colorHex: '#DC2626', min: 29, max: 50 },
  { brand: 'DMM Dragon', size: '4',  colorName: '黄', colorHex: '#EAB308', min: 38, max: 64 },
  { brand: 'DMM Dragon', size: '5',  colorName: '蓝', colorHex: '#1D4ED8', min: 50, max: 85 },
  { brand: 'DMM Dragon', size: '6',  colorName: '银', colorHex: '#9CA3AF', min: 68, max: 114 },

  // ===== DMM Dragonfly =====
  { brand: 'DMM Dragonfly', size: '1', colorName: '—', colorHex: '#06B6D4', min: 7.8,  max: 11.0 },
  { brand: 'DMM Dragonfly', size: '2', colorName: '—', colorHex: '#0891B2', min: 8.7,  max: 12.9 },
  { brand: 'DMM Dragonfly', size: '3', colorName: '—', colorHex: '#0E7490', min: 10.2, max: 15.8 },
  { brand: 'DMM Dragonfly', size: '4', colorName: '—', colorHex: '#155E75', min: 12.1, max: 18.8 },
  { brand: 'DMM Dragonfly', size: '5', colorName: '—', colorHex: '#164E63', min: 14.1, max: 22.5 },
  { brand: 'DMM Dragonfly', size: '6', colorName: '—', colorHex: '#083344', min: 17.5, max: 28.0 },

  // ===== WC Friend =====
  { brand: 'WC Friend', size: '0.4',  colorName: '—', colorHex: '#9CA3AF', min: 15.8, max: 26.4 },
  { brand: 'WC Friend', size: '0.5',  colorName: '—', colorHex: '#8B5CF6', min: 20.6, max: 34.5 },
  { brand: 'WC Friend', size: '0.75', colorName: '—', colorHex: '#16A34A', min: 24.6, max: 41.1 },
  { brand: 'WC Friend', size: '1',    colorName: '—', colorHex: '#DC2626', min: 30.9, max: 51.8 },
  { brand: 'WC Friend', size: '2',    colorName: '—', colorHex: '#EAB308', min: 41.5, max: 69.2 },
  { brand: 'WC Friend', size: '3',    colorName: '—', colorHex: '#2563EB', min: 52.7, max: 87.8 },
  { brand: 'WC Friend', size: '4',    colorName: '—', colorHex: '#6B7280', min: 66.8, max: 113.8 },
  { brand: 'WC Friend', size: '5',    colorName: '—', colorHex: '#7C3AED', min: 87.1, max: 147.0 },
  { brand: 'WC Friend', size: '6',    colorName: '—', colorHex: '#15803D', min: 112.6, max: 190.0 },

  // ===== WC Zero =====
  { brand: 'WC Zero', size: '0.1',  colorName: '—', colorHex: '#EF4444', min: 8.4,  max: 13.8 },
  { brand: 'WC Zero', size: '0.2',  colorName: '—', colorHex: '#FACC15', min: 9.9,  max: 16.9 },
  { brand: 'WC Zero', size: '0.3',  colorName: '—', colorHex: '#3B82F6', min: 12.3, max: 20.8 },
  { brand: 'WC Zero', size: '0.4',  colorName: '—', colorHex: '#9CA3AF', min: 14.8, max: 24.6 },
  { brand: 'WC Zero', size: '0.5',  colorName: '—', colorHex: '#8B5CF6', min: 17.8, max: 29.7 },
  { brand: 'WC Zero', size: '0.75', colorName: '—', colorHex: '#16A34A', min: 20.9, max: 35.8 },

  // ===== Metolius Master Cam =====
  { brand: 'Metolius', size: '00', colorName: '灰', colorHex: '#9CA3AF', min: 8.5,  max: 12 },
  { brand: 'Metolius', size: '0',  colorName: '紫', colorHex: '#8B5CF6', min: 10,   max: 14 },
  { brand: 'Metolius', size: '1',  colorName: '蓝', colorHex: '#3B82F6', min: 12,   max: 18 },
  { brand: 'Metolius', size: '2',  colorName: '黄', colorHex: '#EAB308', min: 15,   max: 22 },
  { brand: 'Metolius', size: '3',  colorName: '橙', colorHex: '#F97316', min: 18,   max: 28 },
  { brand: 'Metolius', size: '4',  colorName: '红', colorHex: '#DC2626', min: 24,   max: 37 },
  { brand: 'Metolius', size: '5',  colorName: '黑', colorHex: '#1F2937', min: 29,   max: 45 },
  { brand: 'Metolius', size: '6',  colorName: '绿', colorHex: '#16A34A', min: 36,   max: 56 },
  { brand: 'Metolius', size: '7',  colorName: '蓝', colorHex: '#1D4ED8', min: 43,   max: 68 },
  { brand: 'Metolius', size: '8',  colorName: '紫', colorHex: '#7C3AED', min: 52,   max: 85 },

  // ===== Totem =====
  { brand: 'Totem', size: '黑', colorName: '黑', colorHex: '#111827', min: 11.7, max: 18.9 },
  { brand: 'Totem', size: '蓝', colorName: '蓝', colorHex: '#2563EB', min: 13.8, max: 22.5 },
  { brand: 'Totem', size: '黄', colorName: '黄', colorHex: '#EAB308', min: 17.0, max: 27.7 },
  { brand: 'Totem', size: '紫', colorName: '紫', colorHex: '#8B5CF6', min: 20.9, max: 34.2 },
  { brand: 'Totem', size: '绿', colorName: '绿', colorHex: '#16A34A', min: 25.7, max: 42.3 },
  { brand: 'Totem', size: '红', colorName: '红', colorHex: '#DC2626', min: 31.6, max: 52.2 },
  { brand: 'Totem', size: '橙', colorName: '橙', colorHex: '#F97316', min: 39.7, max: 64.2 },

  // ===== Fixe Aliens =====
  { brand: 'Alien', size: '黑', colorName: '黑', colorHex: '#111827', min: 10.5, max: 17.0 },
  { brand: 'Alien', size: '蓝', colorName: '蓝', colorHex: '#2563EB', min: 13.75, max: 22.2 },
  { brand: 'Alien', size: '绿', colorName: '绿', colorHex: '#16A34A', min: 16.5, max: 27.7 },
  { brand: 'Alien', size: '黄', colorName: '黄', colorHex: '#EAB308', min: 19.8, max: 33.7 },
  { brand: 'Alien', size: '灰', colorName: '灰', colorHex: '#9CA3AF', min: 23.8, max: 41.3 },
  { brand: 'Alien', size: '红', colorName: '红', colorHex: '#DC2626', min: 29.2, max: 50.3 },
  { brand: 'Alien', size: '紫', colorName: '紫', colorHex: '#7C3AED', min: 36.0, max: 62.0 },
];
