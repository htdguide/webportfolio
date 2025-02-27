import React, { useState, useEffect } from 'react';
import './BatteryMiniApp.css';
import batteryPng from '../../media/assets/battery.png';

function BatteryMiniApp() {
  const [batteryLevel, setBatteryLevel] = useState(85);

  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel((prev) =>
        Math.max(0, Math.min(100, prev + (Math.random() * 10 - 5)))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="battery-miniapp-container">
      <h3>Battery Status</h3>
      <p>Current battery level: {Math.round(batteryLevel)}%</p>

      <div className="battery-icon-wrapper">
        <img
          src={batteryPng}
          alt="Battery Icon"
          className="battery-icon-image"
          style={{ width: '50px', height: '50px', opacity: 0.8 }}
        />

        <div
          className="battery-level-indicator"
          style={{
            top: '9.5px',   // Restoring original bar position
            left: '3px',
            height: '8px',  // Restoring original bar height
            width: `${(batteryLevel / 100) * 18.5}px`, // Restoring original width scale
          }}
        />
      </div>
    </div>
  );
}

export default BatteryMiniApp;
