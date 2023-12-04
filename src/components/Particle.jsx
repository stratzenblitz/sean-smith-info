import React, { useEffect, useState } from 'react';
import './Particle.css'; // Create this file for styling

const Particle = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 4, y: 0 }); // Initial velocity

  useEffect(() => {
    const updateParticle = () => {
      // Update position based on velocity
      setPosition((prevPosition) => ({
        x: prevPosition.x + velocity.x,
        y: prevPosition.y + velocity.y,
      }));

      // Apply gravity (adjust the gravity value as needed)
      setVelocity((prevVelocity) => ({
        x: prevVelocity.x,
        y: prevVelocity.y + 0.1, // Gravity force
      }));

      // Reset position and velocity when the particle reaches the right edge
      if (position.x > window.innerWidth) {
        setPosition({ x: 0, y: 0 });
        setVelocity({ x: 4, y: 0 });
      }
    };

    // Start animation loop
    const animationId = requestAnimationFrame(function animate() {
      updateParticle();
      animationId && requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId); // Cleanup on component unmount
  }, [position, velocity]);

  return <div className="particle" style={{ left: position.x, top: position.y }}></div>;
};

export default Particle;