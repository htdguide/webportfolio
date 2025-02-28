import React, { useState, useRef, useEffect } from 'react';
import MiniWindow from '../MiniWindow/MiniWindow';
import MiniAppsList from '../../lists/MiniAppsList';
import { FocusWrapper, useFocus } from '../../interactions/FocusControl/FocusControl.jsx'; // Import focus tracking
import './MiniApps.css';

function MiniApps() {
  const [activeApp, setActiveApp] = useState(null);
  const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0 });
  const iconRefs = useRef({}); // Store refs dynamically
  const { focusedComponent } = useFocus(); // Get focused component

  // Update MiniWindow position
  const updateAnchorPosition = (appId) => {
    if (iconRefs.current[appId]) {
      const rect = iconRefs.current[appId].getBoundingClientRect();
      setAnchorPos({ x: rect.left, y: rect.top + rect.height });
    }
  };

  // Handle app click
  const handleAppClick = (appItem) => {
    if (activeApp && activeApp.id === appItem.id) {
      setActiveApp(null);
    } else {
      setActiveApp(appItem);
      updateAnchorPosition(appItem.id);
    }
  };

  // Close MiniWindow when focus is lost
  useEffect(() => {
    if (focusedComponent !== 'MiniApps') {
      setActiveApp(null);
    }
  }, [focusedComponent]);

  useEffect(() => {
    const handleResize = () => {
      if (activeApp) updateAnchorPosition(activeApp.id);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeApp]);

  const sortedApps = MiniAppsList.slice()
    .sort((a, b) => a.priority - b.priority)
    .reverse();

  const ActiveComponent = activeApp ? activeApp.miniApp : null;

  return (
    <FocusWrapper name="MiniApps"> {/* Wrap with FocusWrapper */}
      <div className="menu-bar-icons" style={{ display: 'flex', alignItems: 'center', pointerEvents: 'auto' }}>
        {sortedApps.map((appItem) => {
          const { id, name, barApp: BarApp, icon, iconSize = 30 } = appItem;
          const isActive = activeApp && activeApp.id === id;

          return (
            <div
              key={id}
              className={`menu-bar-app ${isActive ? 'active' : ''}`}
              ref={(el) => (iconRefs.current[id] = el)}
              onClick={() => handleAppClick(appItem)}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                pointerEvents: 'auto',
                height: '25px',
                marginLeft: '18px',
                borderRadius: '6px',
                background: isActive ? 'rgba(0, 0, 0, 0.15)' : 'transparent',
              }}
            >
              {BarApp ? (
                <BarApp />
              ) : (
                <img
                  src={icon}
                  alt={name}
                  className="menu-bar-icon"
                  style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
                />
              )}
            </div>
          );
        })}

        {activeApp && ActiveComponent && (
          <MiniWindow anchorPos={anchorPos} onClose={() => setActiveApp(null)}>
            <ActiveComponent />
          </MiniWindow>
        )}
      </div>
    </FocusWrapper>
  );
}

export default MiniApps;
