import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// Dynamically import all images from the carouselbanners folder
// When new images are added to the folder, they will be included after rebuild
const bannerModules = import.meta.glob('/public/carouselbanners/*.{png,jpg,jpeg,webp,gif}', {
  eager: true,
  import: 'default',
});

export const BannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Touch/swipe state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50; // minimum swipe distance in pixels

  // Extract banner URLs from the imported modules
  const banners = useMemo(() => {
    return Object.keys(bannerModules)
      .sort()
      .map((path) => {
        // Convert /public/carouselbanners/banner1.png to /carouselbanners/banner1.png
        return path.replace('/public', '');
      });
  }, []);

  // Filter out failed images
  const validBanners = useMemo(() => {
    return banners.filter((banner) => !failedImages.has(banner));
  }, [banners, failedImages]);

  // Security: Handle image load errors gracefully
  const handleImageError = useCallback((banner: string) => {
    setFailedImages((prev) => new Set(prev).add(banner));
  }, []);

  // Touch event handlers for swipe navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    if (validBanners.length <= 1) return;

    const distance = touchStartX.current - touchEndX.current;
    const isSwipe = Math.abs(distance) > minSwipeDistance;

    if (isSwipe) {
      if (distance > 0) {
        // Swipe left - go to next slide
        setCurrentIndex((prev) => (prev + 1) % validBanners.length);
      } else {
        // Swipe right - go to previous slide
        setCurrentIndex((prev) => (prev - 1 + validBanners.length) % validBanners.length);
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }, [validBanners.length]);

  // Auto-rotate every 2.5 seconds
  useEffect(() => {
    if (validBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validBanners.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [validBanners.length]);

  // Reset index if it exceeds valid banners count
  useEffect(() => {
    if (currentIndex >= validBanners.length && validBanners.length > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, validBanners.length]);

  // Don't render if no valid banners
  if (validBanners.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-2">
      <div
        className="relative w-full overflow-hidden rounded-lg shadow-md touch-pan-y cursor-grab active:cursor-grabbing"
        style={{ aspectRatio: '2 / 1' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {validBanners.map((banner, index) => (
          <img
            key={banner}
            src={banner}
            alt={`Banner ${index + 1}`}
            onError={() => handleImageError(banner)}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Indicator dots */}
        {validBanners.length > 1 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            {validBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-3'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
