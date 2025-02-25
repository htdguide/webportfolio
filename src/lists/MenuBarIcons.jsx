import React, { useState } from 'react';
import MiniWindow from '../components/MiniWindow/MiniWindow';
import batteryIcon from '../media/icons/battery.png'; // Replace with your battery icon file
import BatteryMiniApp from '../miniapps/BatteryMiniApp/BatteryMiniApp';
/**
 * Icons list for the menubar miniapps.
 * Lower priority numbers appear at the right (i.e. newer icons added from right to left).
 */
const iconsList = [
  {
    id: 'battery',
    name: 'Battery',
    icon: batteryIcon,
    component: BatteryMiniApp,
    priority: 1,
  },
  // Add more icons/apps here as needed
];

function MenuBarIcons() {
  const [activeApp, setActiveApp] = useState(null);
  const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0 });

  const handleIconClick = (icon, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // Position miniwindow so that its left edge aligns with the icon's left,
    // and its top is exactly at the bottom of the menubar.
    setAnchorPos({ x: rect.left, y: rect.top + rect.height });
    setActiveApp(activeApp && activeApp.id === icon.id ? null : icon);
  };

  // Sort icons by priority ascending then reverse for right-to-left display.
  const sortedIcons = iconsList.slice().sort((a, b) => a.priority - b.priority).reverse();
  const ActiveComponent = activeApp ? activeApp.component : null;

  return (
    <div
      className="menu-bar-icons"
      style={{ display: 'flex', alignItems: 'center', pointerEvents: 'auto' }}
    >
      {sortedIcons.map((icon) => (
        <img
          key={icon.id}
          src={icon.icon}
          alt={icon.name}
          className="menu-bar-icon"
          onClick={(e) => handleIconClick(icon, e)}
          style={{
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            marginRight: '10px',
            pointerEvents: 'auto',
          }}
        />
      ))}
      {activeApp && ActiveComponent && (
        <MiniWindow anchorPos={anchorPos} onClose={() => setActiveApp(null)}>
          <ActiveComponent />
        </MiniWindow>
      )}
    </div>
  );
}

export default MenuBarIcons;
