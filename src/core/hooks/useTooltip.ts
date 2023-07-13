import {useState, useEffect, RefObject} from 'react';

const useTooltip = (containerRef: RefObject<HTMLDivElement | null>) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    const handleTooltipVisibility = () => {
      const containerWidth = containerRef.current?.offsetWidth;
      const textScrollWidth = containerRef.current?.scrollWidth;

      if (containerWidth != null && textScrollWidth != null) {
        setIsTooltipVisible(textScrollWidth > containerWidth);
      }
    };

    handleTooltipVisibility();

    window.addEventListener('resize', handleTooltipVisibility);
    return () => {
      window.removeEventListener('resize', handleTooltipVisibility);
    };
  }, [containerRef]);

  return isTooltipVisible;
};

export default useTooltip;
