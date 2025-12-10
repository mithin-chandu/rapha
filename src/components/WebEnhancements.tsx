import React, { useEffect } from 'react';
import { Platform } from 'react-native';

interface WebEnhancementsProps {
  children: React.ReactNode;
}

export const WebEnhancements: React.FC<WebEnhancementsProps> = ({ children }) => {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Add web-specific enhancements
      const addWebStyles = () => {
        // Create style element for dynamic web enhancements
        const styleElement = document.createElement('style');
        styleElement.id = 'rapha-web-enhancements';
        
        // Prevent duplicate styles
        const existingStyle = document.getElementById('rapha-web-enhancements');
        if (existingStyle) {
          existingStyle.remove();
        }
        
        styleElement.textContent = `
          /* Critical page structure fixes */
          html, body {
            height: 100%;
            min-height: 100vh;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            overflow-y: auto;
          }
          
          #root {
            min-height: 100vh;
            height: auto;
            width: 100%;
            overflow: visible;
            display: flex;
            flex-direction: column;
          }
          
          /* React Navigation Container fixes */
          .react-navigation-container {
            flex: 1;
            min-height: 100vh;
            height: auto;
            overflow: visible;
          }
          
          /* Enhanced tab navigation for web */
          .rn-tab-bar {
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1) !important;
            backdrop-filter: blur(10px) !important;
            border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
          }
          
          /* Tab button enhancements */
          .rn-tab-button {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative !important;
          }
          
          .rn-tab-button:hover {
            transform: translateY(-2px) !important;
          }
          
          .rn-tab-button:active {
            transform: translateY(0) !important;
          }
          
          /* Active tab indicator */
          .rn-tab-button.active::before {
            content: '';
            position: absolute;
            top: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 24px;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            border-radius: 0 0 2px 2px;
          }
          
          /* Responsive layout adjustments */
          @media (min-width: 768px) {
            .rn-navigation-container {
              width: 100% !important;
              border-radius: 12px !important;
              overflow: hidden !important;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1) !important;
              background: #f8f9fa !important;
            }
          }
          
          @media (min-width: 1024px) {
            .rn-navigation-container {
              width: 100% !important;
            }
          }
          
          /* Fix white corners issue */
          .rn-view, .react-native-view {
            background-clip: padding-box !important;
          }
          
          /* Ensure profile screen fills container properly */
          .rn-scrollview .rn-view:first-child {
            border-top-left-radius: 12px !important;
            border-top-right-radius: 12px !important;
            overflow: hidden !important;
          }
          
          /* Smooth transitions for all interactive elements */
          button, [role="button"], [role="tab"] {
            transition: all 0.2s ease !important;
          }
          
          /* Enhanced focus states for accessibility */
          *:focus-visible {
            outline: 2px solid #3b82f6 !important;
            outline-offset: 2px !important;
            border-radius: 4px !important;
          }
          
          /* Improved card shadows */
          .rn-card {
            transition: transform 0.2s ease !important;
          }
          
          .rn-card:hover {
            transform: translateY(-2px) !important;
          }
          
          /* Loading states */
          .rn-loading {
            animation: pulse 2s infinite !important;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          /* Hide scrollbar while maintaining functionality */
          .rn-scrollview {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
          
          .rn-scrollview::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
        `;
        
        document.head.appendChild(styleElement);
      };
      
      // Apply styles after component mounts
      setTimeout(addWebStyles, 100);
      
      // Add viewport meta tag for proper mobile responsiveness
      const viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(meta);
      }
      
      // Clean up on unmount
      return () => {
        const styleElement = document.getElementById('rapha-web-enhancements');
        if (styleElement) {
          styleElement.remove();
        }
      };
    }
  }, []);
  
  // Add class names to DOM elements for better styling
  useEffect(() => {
    if (Platform.OS === 'web') {
      const addClassNames = () => {
        // Add navigation container class
        const navContainers = document.querySelectorAll('[role="navigation"]');
        navContainers.forEach(container => {
          container.classList.add('rn-navigation-container');
        });
        
        // Add tab bar classes
        const tabBars = document.querySelectorAll('[role="tablist"]');
        tabBars.forEach(tabBar => {
          tabBar.classList.add('rn-tab-bar');
        });
        
        // Add tab button classes
        const tabButtons = document.querySelectorAll('[role="tab"]');
        tabButtons.forEach(button => {
          button.classList.add('rn-tab-button');
          
          // Add active class to selected tabs
          if (button.getAttribute('aria-selected') === 'true') {
            button.classList.add('active');
          } else {
            button.classList.remove('active');
          }
        });
        
        // Add scroll view classes
        const scrollViews = document.querySelectorAll('[data-testid="scroll-view"]');
        scrollViews.forEach(scroll => {
          scroll.classList.add('rn-scrollview');
        });
        
        // Add card classes
        const cards = document.querySelectorAll('[data-card="true"]');
        cards.forEach(card => {
          card.classList.add('rn-card');
        });
      };
      
      // Initial application
      setTimeout(addClassNames, 200);
      
      // Reapply on route changes
      const observer = new MutationObserver(addClassNames);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-selected']
      });
      
      return () => observer.disconnect();
    }
  }, []);

  return <>{children}</>;
};