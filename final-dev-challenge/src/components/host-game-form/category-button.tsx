import { useState } from 'react';

import { useAutoAnimate } from '@formkit/auto-animate/react';

import { CATEGORIES } from '~/core/constants';
import { Category } from '~/core/types';
import { cn } from '~/utils/cn';

const DESCRIPTIONS: Record<Category, string> = {
  [CATEGORIES.ANIMALS]: "There's more than meets the eye",
  [CATEGORIES.PH]: "It's more fun in the Philippines!",
};

interface Props {
  isDisabled: boolean;
  category: Category;
  currentSelected: Category | null;
  imageUrl?: string;
  setSelection: (selection: Category) => void;
}

export const CategoryButton = (props: Props) => {
  const { isDisabled, currentSelected, category, imageUrl, setSelection } =
    props;
  const isSelected = currentSelected === category;

  const [animateRef] = useAutoAnimate({
    duration: 100,
    easing: 'linear',
  });

  const [isHovering, setIsHovering] = useState(false);

  const onClick = () => setSelection(category);

  return (
    <div className="size-80 grow">
      <button
        ref={animateRef}
        type="button"
        className={cn(
          'btn flex size-full flex-col gap-4 hover:border hover:border-white/20',
          {
            'btn-neutral border border-secondary/50': isSelected,
            'btn-disabled opacity-60 pointer-events-none': isDisabled,
          },
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        disabled={isDisabled}
        onClick={onClick}
      >
        {(isHovering || isSelected) && imageUrl && (
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img src={imageUrl} />
            </div>
          </div>
        )}
        <span className="text-4xl font-bold">{category}</span>
        {(isHovering || isSelected) && (
          <span className="w-full shrink-0 text-lg text-white/80">
            {DESCRIPTIONS[category]}
          </span>
        )}
      </button>
    </div>
  );
};
