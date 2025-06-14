
"use client";

import Image from 'next/image';
import { Plus } from 'lucide-react';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryItemProps {
  category: Category;
  onClick: (id: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onClick }) => {
  const borderColor = category.viewed ? 'border-muted' : 'border-primary';

  return (
    <div
      className="flex-shrink-0 flex flex-col items-center cursor-pointer w-20 group"
      onClick={() => onClick(category.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(category.id)}
    >
      {category.type === 'moments' ? (
        <div className={cn(`w-14 h-14 rounded-full flex items-center justify-center text-primary border-2 ${borderColor} group-hover:scale-105 transition-transform duration-200 ease-in-out`, category.color || 'bg-primary/10')}>
          <Plus className="w-8 h-8" />
        </div>
      ) : category.image ? (
        <div className={`w-14 h-14 rounded-full border-2 ${borderColor} overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-200 ease-in-out`}>
          <Image src={category.image} alt={category.name || 'Category image'} width={56} height={56} className="w-full h-full object-cover" data-ai-hint={category.dataAiHint} />
        </div>
      ) : (
        // Fallback for categories with icon but no image (if any)
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-primary-foreground border-2 ${borderColor} ${category.color || 'bg-primary'} group-hover:scale-105 transition-transform duration-200 ease-in-out`}>
           {typeof category.icon === 'function' ? <category.icon className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
        </div>
      )}
      {category.name && <span className="text-xs mt-1 text-foreground font-medium text-center truncate w-full">{category.name}</span>}
    </div>
  );
};

export default CategoryItem;
