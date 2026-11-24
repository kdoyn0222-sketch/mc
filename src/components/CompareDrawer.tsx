import React from 'react';
import { X, Trash2, Scale } from 'lucide-react';
import { ComparisonEntry } from '../types/menu';
import { PORTION_LABELS } from '../data/labels';

interface CompareDrawerProps {
  open: boolean;
  entries: ComparisonEntry[];
  onClose: () => void;
  onRemoveEntry: (uid: string) => void;
  onClearAll: () => void;
}

const MEAL_TYPE_LABELS: Record<ComparisonEntry['mealType'], string> = {
  single: '단품',
  set: '일반 세트',
  mclunch: '맥런치 세트',
};

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  open,
  entries,
  onClose,
  onRemoveEntry,
  onClearAll,
}) => {
  if (!open) return null;

  const [first, second] = entries;

  const rows: {
    label: string;
    key: keyof Pick<
      ComparisonEntry,
      'calories' | 'protein' | 'sodium' | 'saturatedFat' | 'sugar' | 'weightGrams' | 'price'
    >;
    unit: string;
    preferLower: boolean;
  }[] = [
    { label: '열량', key: 'calories', unit: 'kcal', preferLower: true },
    { label: '단백질', key: 'protein', unit: 'g', preferLower: false },
    { label: '나트륨', key: 'sodium', unit: 'mg', preferLower: true },
    { label: '포화지방', key: 'saturatedFat', unit: 'g', preferLower: true },
    { label: '당류', key: 'sugar', unit: 'g', preferLower: true },
    { label: '버거 중량', key: 'weightGrams', unit: 'g', preferLower: false },
    { label: '가격', key: 'price', unit: '원', preferLower: true },
  ];

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 bg-white border-t-2 border-[#1E1E1E] shadow-[0_-16px_40px_rgba(0,0,0,0.2)] max-h-[82vh] flex flex-col"
      role="dialog"
      aria-label="영양성분 비교함"
    >
      <div className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 border-b border-[#1E1E1E]/10">
        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5 text-[#DA291C]" />
          <h3 className="font-display text-base sm:text-lg font-extrabold text-[#1E1E1E] keep-all">
            영양성분 &amp; 중량 나란히 비교 ({entries.length}/2)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {entries.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F8F6F2] hover:bg-[#FFF0EE] text-xs font-bold text-[#DA291C] cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>전체 비우기</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-[#F8F6F2] hover:bg-[#1E1E1E]/10 text-[#1E1E1E] cursor-pointer"
            aria-label="영양성분 비교함 닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <p className="text-sm font-bold text-[#1E1E1E]">
              아직 비교함에 담긴 버거가 없습니다.
            </p>
            <p className="text-xs text-[#1E1E1E]/65 keep-all">
              메뉴 카드의 &ldquo;+ 비교&rdquo; 버튼이나 상세 커스터마이저에서 최대 2개의 버거 구성을 담아 영양성분과 가격을 나란히 비교해 보세요.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E1E1E]/15">
                  <th className="py-3 pr-4 w-36 text-xs font-bold text-[#1E1E1E]/60">
                    비교 항목
                  </th>
                  <th className="py-3 px-4 min-w-[210px]">
                    {first && (
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-sm sm:text-base font-extrabold text-[#1E1E1E] keep-all">
                            {first.name}
                          </p>
                          <p className="text-[11px] font-medium text-[#1E1E1E]/60 mt-0.5 keep-all">
                            {MEAL_TYPE_LABELS[first.mealType]} · {PORTION_LABELS[first.portionLevel]} · {first.customizationsSummary}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveEntry(first.uid)}
                          className="p-1 rounded hover:bg-[#1E1E1E]/10 text-[#1E1E1E]/60 hover:text-[#DA291C] cursor-pointer"
                          aria-label={`${first.name} 제거`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </th>
                  <th className="py-3 pl-4 min-w-[210px]">
                    {second ? (
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-sm sm:text-base font-extrabold text-[#1E1E1E] keep-all">
                            {second.name}
                          </p>
                          <p className="text-[11px] font-medium text-[#1E1E1E]/60 mt-0.5 keep-all">
                            {MEAL_TYPE_LABELS[second.mealType]} · {PORTION_LABELS[second.portionLevel]} · {second.customizationsSummary}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveEntry(second.uid)}
                          className="p-1 rounded hover:bg-[#1E1E1E]/10 text-[#1E1E1E]/60 hover:text-[#DA291C] cursor-pointer"
                          aria-label={`${second.name} 제거`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-[#1E1E1E]/45">
                        두 번째 버거를 추가해 나란히 비교해 보세요
                      </span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E1E]/10 text-sm">
                <tr>
                  <td className="py-2.5 pr-4 text-xs font-bold text-[#1E1E1E]/70">
                    분량 등급
                  </td>
                  <td className="py-2.5 px-4 text-xs font-bold text-[#1E1E1E]">
                    {first ? PORTION_LABELS[first.portionLevel] : '—'}
                  </td>
                  <td className="py-2.5 pl-4 text-xs font-bold text-[#1E1E1E]">
                    {second ? PORTION_LABELS[second.portionLevel] : '—'}
                  </td>
                </tr>
                {rows.map((row) => {
                  const v1 = first ? first[row.key] : null;
                  const v2 = second ? second[row.key] : null;
                  const bothPresent = v1 !== null && v2 !== null && v1 !== v2;
                  const firstWins =
                    bothPresent && (row.preferLower ? v1! < v2! : v1! > v2!);
                  const secondWins =
                    bothPresent && (row.preferLower ? v2! < v1! : v2! > v1!);

                  return (
                    <tr key={row.key}>
                      <td className="py-2.5 pr-4 text-xs font-bold text-[#1E1E1E]/70">
                        {row.label}
                      </td>
                      <td className="py-2.5 px-4 font-mono-num font-bold">
                        {v1 !== null && (
                          <span className={firstWins ? 'text-[#1D6B3A]' : 'text-[#1E1E1E]'}>
                            {v1.toLocaleString()}
                            {row.unit === '원' ? '원' : ` ${row.unit}`}
                            {firstWins && row.key !== 'weightGrams' && (
                              <span className="ml-2 text-[11px] font-sans font-bold text-[#1D6B3A]">
                                {row.preferLower ? '더 낮음' : '더 높음'}
                              </span>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pl-4 font-mono-num font-bold">
                        {v2 !== null ? (
                          <span className={secondWins ? 'text-[#1D6B3A]' : 'text-[#1E1E1E]'}>
                            {v2.toLocaleString()}
                            {row.unit === '원' ? '원' : ` ${row.unit}`}
                            {secondWins && row.key !== 'weightGrams' && (
                              <span className="ml-2 text-[11px] font-sans font-bold text-[#1D6B3A]">
                                {row.preferLower ? '더 낮음' : '더 높음'}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-[#1E1E1E]/30">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
