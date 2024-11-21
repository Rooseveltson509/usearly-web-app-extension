import React, { useEffect, useState } from 'react';

interface AnimatedPointsProps {
  startPoints: number;
  endPoints: number;
  duration?: number; // En millisecondes
}

const AnimatedPoints: React.FC<AnimatedPointsProps> = ({
  startPoints,
  endPoints,
  duration = 1000, // Durée de l'animation (par défaut 1s)
}) => {
  const [currentPoints, setCurrentPoints] = useState(startPoints);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const stepTime = Math.ceil(duration / (endPoints - startPoints));

    if (startPoints < endPoints) {
      interval = setInterval(() => {
        setCurrentPoints((prev) => {
          if (prev >= endPoints) {
            clearInterval(interval!);
            return prev;
          }
          return prev + 1;
        });
      }, stepTime);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startPoints, endPoints, duration]);

  return (
    <div className="points-container">
      <span className="points-animation">{currentPoints} points</span>
    </div>
  );
};

export default AnimatedPoints;
