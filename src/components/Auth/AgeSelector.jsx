import { useState, useRef, useEffect, useMemo } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Button } from "src/components/ui/button";

export function AgeSelector({
  value = 25,
  onChange,
  onNext,
  onBack,
  minAge = 1,
  maxAge = 80,
}) {
  const [selectedAge, setSelectedAge] = useState(value);
  const containerRef = useRef(null);
  const ages = Array.from(
    { length: maxAge - minAge + 1 },
    (_, i) => i + minAge
  );
  const itemHeight = 48; // Height of each age item

  // Create a spring animation for smooth scrolling
  const y = useSpring(0, {
    stiffness: 300,
    damping: 50,
    mass: 0.5,
  });

  // Get the current index of the selected age
  const selectedIndex = ages.indexOf(selectedAge);

  // Update the spring animation target whenever the selection changes
  useEffect(() => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const targetY =
        -(selectedIndex * itemHeight) + containerHeight / 2 - itemHeight / 2;
      y.set(targetY);
    }
  }, [selectedIndex, y]);

  // Re-measure container height on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const targetY =
          -(selectedIndex * itemHeight) + containerHeight / 2 - itemHeight / 2;
        y.set(targetY);
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions(); // Initial measurement

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [selectedIndex, y]);

  // Transform the y spring value for use in the component
  const transformY = useTransform(y, (value) => `${value}px`);

  // Haptic feedback function
  const triggerHapticFeedback = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10); // 10ms vibration
    }
  };

  // Handle mouse wheel events for scrolling
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    const newIndex = Math.max(
      0,
      Math.min(ages.length - 1, selectedIndex + delta)
    );

    if (newIndex !== selectedIndex) {
      setSelectedAge(ages[newIndex]);
      onChange(ages[newIndex]);
      triggerHapticFeedback();
    }
  };

  // Handle touch interactions
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const startY = touch.clientY;
    let lastTouchY = startY;
    let velocity = 0;
    let lastTimestamp = Date.now();

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const currentY = touch.clientY;
      const deltaY = currentY - lastTouchY;
      const timestamp = Date.now();
      const timeDelta = timestamp - lastTimestamp;

      // Calculate velocity (pixels per ms)
      if (timeDelta > 0) {
        velocity = deltaY / timeDelta;
      }

      // Use a scaling factor to control sensitivity
      const scaleFactor = 2;
      const currentYValue = y.get();
      y.set(currentYValue + deltaY * scaleFactor);

      // Update for next move event
      lastTouchY = currentY;
      lastTimestamp = timestamp;

      // Find the closest age to the current position
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const centerOffset = containerHeight / 2 - itemHeight / 2;
        const scrolledPosition = y.get();
        const approximateIndex = Math.round(
          (centerOffset - scrolledPosition) / itemHeight
        );
        const boundedIndex = Math.max(
          0,
          Math.min(ages.length - 1, approximateIndex)
        );

        if (ages[boundedIndex] !== selectedAge) {
          setSelectedAge(ages[boundedIndex]);
          onChange(ages[boundedIndex]);
          triggerHapticFeedback();
        }
      }
    };

    const handleTouchEnd = () => {
      // Apply momentum with decay
      const momentumDecay = 0.95;
      const applyMomentum = () => {
        if (Math.abs(velocity) < 0.1) {
          snapToClosestAge();
          return;
        }

        const currentYValue = y.get();
        velocity *= momentumDecay;
        y.set(currentYValue + velocity * 10);

        requestAnimationFrame(applyMomentum);
      };

      const snapToClosestAge = () => {
        if (containerRef.current) {
          const containerHeight = containerRef.current.clientHeight;
          const centerOffset = containerHeight / 2 - itemHeight / 2;
          const scrolledPosition = y.get();
          const approximateIndex = Math.round(
            (centerOffset - scrolledPosition) / itemHeight
          );
          const boundedIndex = Math.max(
            0,
            Math.min(ages.length - 1, approximateIndex)
          );

          setSelectedAge(ages[boundedIndex]);
          onChange(ages[boundedIndex]);

          // Animate to the exact position for the selected age
          const targetY =
            -(boundedIndex * itemHeight) + containerHeight / 2 - itemHeight / 2;
          y.set(targetY);
        }
      };

      // Start momentum if velocity is significant, otherwise just snap
      if (Math.abs(velocity) > 0.1) {
        applyMomentum();
      } else {
        snapToClosestAge();
      }

      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowUp":
        if (selectedIndex > 0) {
          setSelectedAge(ages[selectedIndex - 1]);
          onChange(ages[selectedIndex - 1]);
          triggerHapticFeedback();
        }
        break;
      case "ArrowDown":
        if (selectedIndex < ages.length - 1) {
          setSelectedAge(ages[selectedIndex + 1]);
          onChange(ages[selectedIndex + 1]);
          triggerHapticFeedback();
        }
        break;
      case "Enter":
        onNext();
        break;
      case "Escape":
        onBack();
        break;
    }
  };
  /* eslint-disable react-hooks/rules-of-hooks */
  const opacityTransforms = ages.map((_, i) =>
    useTransform(y, (v) => {
      const center =
        (containerRef.current?.clientHeight ?? 300) / 2 - itemHeight / 2;
      const dist = Math.abs(v + i * itemHeight - center);
      return 1 - Math.min(dist / (itemHeight * 3), 0.8);
    })
  );

  const scaleTransforms = ages.map((_, i) =>
    useTransform(y, (v) => {
      const center =
        (containerRef.current?.clientHeight ?? 300) / 2 - itemHeight / 2;
      const dist = Math.abs(v + i * itemHeight - center);
      return 1 - Math.min(dist / (itemHeight * 5), 0.3);
    })
  );
  /* eslint-enable react-hooks/rules-of-hooks */

  return (
    <div
      className="flex flex-col items-center justify-center h-full focus-visible:border-2 focus-visible:border-none focus-visible:outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className="relative h-[300px] w-full max-w-[200px] overflow-hidden"
        ref={containerRef}
      >
        {/* Selection highlight area */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="h-12 w-full bg-main/10 border-y-2 border-main" />
        </div>

        {/* Scrollable ages list */}
        <motion.div
          style={{ y: transformY }}
          className="absolute left-0 right-0"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }} // These will be ignored but are required
          dragElastic={0.1}
          dragMomentum={true}
          onDrag={(_, info) => {
            if (containerRef.current) {
              const containerHeight = containerRef.current.clientHeight;
              const centerOffset = containerHeight / 2 - itemHeight / 2;
              const scrolledPosition = y.get();
              const approximateIndex = Math.round(
                (centerOffset - scrolledPosition) / itemHeight
              );
              const boundedIndex = Math.max(
                0,
                Math.min(ages.length - 1, approximateIndex)
              );

              if (ages[boundedIndex] !== selectedAge) {
                setSelectedAge(ages[boundedIndex]);
                onChange(ages[boundedIndex]);
                triggerHapticFeedback();
              }
            }
          }}
          onDragEnd={() => {
            if (containerRef.current) {
              const containerHeight = containerRef.current.clientHeight;
              const targetY =
                -(selectedIndex * itemHeight) +
                containerHeight / 2 -
                itemHeight / 2;
              y.set(targetY);
              triggerHapticFeedback();
            }
          }}
        >
          {ages.map((age, i) => (
            <motion.div
              key={age}
              className="h-12 flex items-center justify-center cursor-pointer"
              onClick={() => {
                setSelectedAge(age);
                onChange(age);
                triggerHapticFeedback();

                if (containerRef.current) {
                  const containerHeight = containerRef.current.clientHeight;
                  const ageIndex = ages.indexOf(age);
                  const targetY =
                    -(ageIndex * itemHeight) +
                    containerHeight / 2 -
                    itemHeight / 2;
                  y.set(targetY);
                }
              }}
            >
              <motion.span
                className={`text-2xl font-medium transition-all ${
                  age === selectedAge
                    ? "text-main font-bold"
                    : "text-muted-foreground "
                }`}
                style={{
                  opacity: opacityTransforms[i],
                  scale: scaleTransforms[i],
                }}
              >
                {age}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between gap-4 mt-8 w-full max-w-[200px]">
        <Button
          variant="outline"
          className="flex-1 bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 hover:text-white"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          className="flex-1 bg-main text-black hover:bg-main/90"
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
