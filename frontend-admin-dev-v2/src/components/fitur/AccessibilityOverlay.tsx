"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Eye, 
  EyeOff, 
  Type, 
  Contrast, 
  MousePointer, 
  Keyboard,
  Volume2,
  VolumeX,
  X,
  Pause,
  Play,
  RotateCcw,
  Focus,
  Move,
  Palette,
  Power,
  PowerOff,
  Accessibility
} from 'lucide-react';

interface AccessibilitySettings {
  // Master Switch
  enabled: boolean;
  
  // Visual Settings
  fontSize: number;
  contrast: 'normal' | 'high' | 'higher';
  brightness: number;
  saturation: number;
  invertColors: boolean;
  grayscale: boolean;
  
  // Motor Settings
  cursorSize: 'normal' | 'large' | 'extra';
  clickAnimation: boolean;
  pauseAnimations: boolean;
  
  // Cognitive Settings
  readingGuide: boolean;
  focusMode: boolean;
  simplifyContent: boolean;
  
  // Audio Settings
  soundEnabled: boolean;
  textToSpeech: boolean;
  
  // Navigation
  keyboardNavigation: boolean;
  skipLinks: boolean;
}

interface SettingButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  disabled?: boolean;
}

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
  disabled?: boolean;
}

const AccessibilityOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const reinitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const cleanupFunctionsRef = useRef<(() => void)[]>([]);
  
  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Default settings
    const defaultSettings: AccessibilitySettings = {
      enabled: false,
      fontSize: 100,
      contrast: 'normal',
      brightness: 100,
      saturation: 100,
      invertColors: false,
      grayscale: false,
      cursorSize: 'normal',
      clickAnimation: false,
      pauseAnimations: false,
      readingGuide: false,
      focusMode: false,
      simplifyContent: false,
      soundEnabled: true,
      textToSpeech: false,
      keyboardNavigation: true,
      skipLinks: true
    };

    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedSettings = localStorage.getItem('accessibility-settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          // Merge with defaults to ensure all properties exist
          return { ...defaultSettings, ...parsed };
        }
      } catch (error) {
        console.warn('Failed to load accessibility settings:', error);
      }
    }

    return defaultSettings;
  });

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('accessibility-settings', JSON.stringify(settings));
      } catch (error) {
        console.warn('Failed to save accessibility settings:', error);
      }
    }
  }, [settings]);

  // Clear all accessibility effects - more comprehensive cleanup
  const clearAllEffects = useCallback((): void => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    
    // Remove ALL CSS properties
    root.style.removeProperty('--accessibility-font-scale');
    root.style.removeProperty('--cursor-scale');
    root.style.removeProperty('--animation-duration');
    root.style.removeProperty('--transition-duration');
    
    // Reset filter to empty (removes all visual filters)
    root.style.filter = '';
    
    // Remove ALL classes
    root.classList.remove('focus-mode');
    
    // Remove reading guide completely
    const guide = document.getElementById('reading-guide');
    if (guide) {
      guide.remove();
    }
    
    // Clean up ALL event listeners
    cleanupFunctionsRef.current.forEach(cleanup => cleanup());
    cleanupFunctionsRef.current = [];
    
    // Remove all TTS listeners
    const elementsWithListeners = document.querySelectorAll('[data-accessibility-listener]');
    elementsWithListeners.forEach(element => {
      element.removeAttribute('data-accessibility-listener');
      // Remove all event listeners that might be attached
      const clonedElement = element.cloneNode(true);
      element.parentNode?.replaceChild(clonedElement, element);
    });
    
    // Stop any speech immediately
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    // Clear any timeouts
    if (reinitTimeoutRef.current) {
      clearTimeout(reinitTimeoutRef.current);
      reinitTimeoutRef.current = null;
    }
  }, []);

  // Apply settings to document
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // ALWAYS clear previous effects first regardless of enabled state
    const root = document.documentElement;
    root.style.removeProperty('--accessibility-font-scale');
    root.style.removeProperty('--cursor-scale');
    root.style.removeProperty('--animation-duration');
    root.style.removeProperty('--transition-duration');
    root.style.filter = '';
    root.classList.remove('focus-mode');
    
    // Remove reading guide
    const guide = document.getElementById('reading-guide');
    if (guide) {
      guide.remove();
    }
    
    // Clean up previous event listeners
    cleanupFunctionsRef.current.forEach(cleanup => cleanup());
    cleanupFunctionsRef.current = [];
    
    // Stop any speech
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    // STOP HERE if accessibility is disabled - don't apply any effects
    if (!settings.enabled) {
      return;
    }
    
    // Only apply effects if accessibility is ENABLED
    
    // Font Size
    if (settings.fontSize !== 100) {
      root.style.setProperty('--accessibility-font-scale', `${settings.fontSize / 100}`);
    }
    
    // Visual filters
    const filters: string[] = [];
    if (settings.contrast === 'high') filters.push('contrast(150%)');
    if (settings.contrast === 'higher') filters.push('contrast(200%)');
    if (settings.brightness !== 100) filters.push(`brightness(${settings.brightness}%)`);
    if (settings.saturation !== 100) filters.push(`saturate(${settings.saturation}%)`);
    if (settings.invertColors) filters.push('invert(1)');
    if (settings.grayscale) filters.push('grayscale(1)');
    
    if (filters.length > 0) {
      root.style.filter = filters.join(' ');
    }
    
    // Cursor size
    if (settings.cursorSize !== 'normal') {
      const cursorSizes: Record<AccessibilitySettings['cursorSize'], string> = {
        normal: '1',
        large: '2',
        extra: '3'
      };
      root.style.setProperty('--cursor-scale', cursorSizes[settings.cursorSize]);
    }
    
    // Pause animations
    if (settings.pauseAnimations) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    }
    
    // Reading guide
    if (settings.readingGuide) {
      const cleanup = addReadingGuide();
      if (cleanup) cleanupFunctionsRef.current.push(cleanup);
    }
    
    // Focus mode
    if (settings.focusMode) {
      root.classList.add('focus-mode');
    }
    
    // Text to speech for all elements
    if (settings.textToSpeech) {
      // Add a small delay to ensure DOM is ready after navigation
      const timeoutId = setTimeout(() => {
        const cleanup = enableTextToSpeech();
        if (cleanup) {
          cleanupFunctionsRef.current.push(cleanup);
        }
      }, 500);
      
      cleanupFunctionsRef.current.push(() => clearTimeout(timeoutId));
    }
  }, [settings]); // Depend on ALL settings, not just enabled

  // Re-initialize text-to-speech on route changes (App Router compatibility)
  useEffect(() => {
    if (typeof window === 'undefined' || !settings.enabled || !settings.textToSpeech) return;

    // Listen for route changes in App Router
    const handleRouteChange = (): void => {
      if (settings.textToSpeech && settings.enabled) {
        // Re-enable text-to-speech after a short delay to ensure new DOM is loaded
        if (reinitTimeoutRef.current) {
          clearTimeout(reinitTimeoutRef.current);
        }
        reinitTimeoutRef.current = setTimeout(() => {
          const cleanup = enableTextToSpeech();
          if (cleanup) {
            cleanupFunctionsRef.current.push(cleanup);
          }
        }, 1000);
      }
    };

    // Listen for navigation events
    window.addEventListener('popstate', handleRouteChange);
    
    // For App Router, we need to detect DOM changes
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      const hasSignificantChanges = mutations.some(mutation => 
        mutation.type === 'childList' && 
        mutation.addedNodes.length > 0 &&
        Array.from(mutation.addedNodes).some(node => 
          node.nodeType === Node.ELEMENT_NODE &&
          (node as Element).tagName !== 'SCRIPT' &&
          (node as Element).tagName !== 'STYLE'
        )
      );
      
      if (hasSignificantChanges && settings.textToSpeech && settings.enabled) {
        // Debounce the re-initialization
        if (reinitTimeoutRef.current) {
          clearTimeout(reinitTimeoutRef.current);
        }
        reinitTimeoutRef.current = setTimeout(() => {
          const cleanup = enableTextToSpeech();
          if (cleanup) {
            cleanupFunctionsRef.current.push(cleanup);
          }
        }, 1000);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    mutationObserverRef.current = observer;

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect();
        mutationObserverRef.current = null;
      }
      if (reinitTimeoutRef.current) {
        clearTimeout(reinitTimeoutRef.current);
        reinitTimeoutRef.current = null;
      }
    };
  }, [settings.enabled, settings.textToSpeech]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        root.style.removeProperty('--accessibility-font-scale');
        root.style.removeProperty('--cursor-scale');
        root.style.removeProperty('--animation-duration');
        root.style.removeProperty('--transition-duration');
        root.style.filter = '';
        root.classList.remove('focus-mode');
        
        const guide = document.getElementById('reading-guide');
        if (guide) {
          guide.remove();
        }
        
        if ('speechSynthesis' in window) {
          speechSynthesis.cancel();
        }

        // Cleanup all refs
        cleanupFunctionsRef.current.forEach(cleanup => cleanup());
        cleanupFunctionsRef.current = [];

        if (reinitTimeoutRef.current) {
          clearTimeout(reinitTimeoutRef.current);
          reinitTimeoutRef.current = null;
        }

        if (mutationObserverRef.current) {
          mutationObserverRef.current.disconnect();
          mutationObserverRef.current = null;
        }
      }
    };
  }, []);

  const addReadingGuide = useCallback((): (() => void) | null => {
    if (typeof window === 'undefined') return null;
    
    let guide = document.getElementById('reading-guide');
    if (!guide) {
      guide = document.createElement('div');
      guide.id = 'reading-guide';
      guide.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: #3b82f6;
        z-index: 9999;
        pointer-events: none;
        transform: translateY(-100%);
        transition: transform 0.2s ease;
      `;
      document.body.appendChild(guide);
    }
    
    const handleMouseMove = (e: MouseEvent): void => {
      if (guide) {
        guide.style.transform = `translateY(${e.clientY - 1}px)`;
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      const guideElement = document.getElementById('reading-guide');
      if (guideElement) {
        guideElement.remove();
      }
    };
  }, []);

  // Enhanced Text to Speech functionality
  const enableTextToSpeech = useCallback((): (() => void) | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    
    let currentUtterance: SpeechSynthesisUtterance | null = null;
    
    const getTextFromElement = (element: HTMLElement): string => {
      // Handle different element types
      if (element.tagName === 'IMG') {
        const img = element as HTMLImageElement;
        return img.alt || img.title || 'Gambar';
      }
      
      if (element.tagName === 'INPUT') {
        const input = element as HTMLInputElement;
        const label = document.querySelector(`label[for="${input.id}"]`) as HTMLLabelElement | null;
        return label?.textContent?.trim() || 
               input.placeholder || 
               input.getAttribute('aria-label') || 
               `Input ${input.type}`;
      }
      
      if (element.tagName === 'BUTTON') {
        return element.textContent?.trim() || 
               element.getAttribute('aria-label') || 
               element.getAttribute('title') || 
               'Tombol';
      }
      
      if (element.tagName === 'A') {
        return element.textContent?.trim() || 
               element.getAttribute('title') || 
               element.getAttribute('aria-label') || 
               'Link';
      }
      
      if (element.tagName === 'SELECT') {
        const select = element as HTMLSelectElement;
        const selectedOption = select.options[select.selectedIndex];
        return `Pilihan: ${selectedOption?.text || 'Tidak ada pilihan'}`;
      }
      
      // For other elements, get only direct text content
      let text = '';
      
      // Check aria-label first
      const ariaLabel = element.getAttribute('aria-label');
      if (ariaLabel) {
        return ariaLabel;
      }
      
      // Get text from element's direct text nodes
      const childNodes = element.childNodes;
      for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
          const textContent = node.textContent?.trim();
          if (textContent) {
            text += textContent + ' ';
          }
        }
      }
      
      // If no direct text, get first level child text
      if (!text.trim()) {
        const textElements = element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, td, th, li');
        for (let i = 0; i < Math.min(textElements.length, 3); i++) {
          const el = textElements[i] as HTMLElement;
          const elementText = el.textContent?.trim();
          if (elementText && elementText.length < 100) {
            text += elementText + '. ';
          }
        }
      }
      
      return text.trim().substring(0, 200); // Limit to 200 characters
    };
    
    const handleMouseEnter = (e: Event): void => {
      const target = e.target as HTMLElement;
      
      // Skip if target is within accessibility overlay
      if (!target || target.closest('#accessibility-overlay')) return;
      
      // Skip if target is body or html
      if (target.tagName === 'BODY' || target.tagName === 'HTML') return;
      
      const textToSpeak = getTextFromElement(target);
      
      if (textToSpeak && textToSpeak.length > 0) {
        // Cancel previous speech
        speechSynthesis.cancel();
        
        // Create new utterance
        currentUtterance = new SpeechSynthesisUtterance(textToSpeak);
        currentUtterance.rate = 0.9;
        currentUtterance.volume = 0.8;
        currentUtterance.lang = 'id-ID'; // Indonesian language
        
        // Speak with a small delay to avoid rapid-fire speech
        setTimeout(() => {
          if (currentUtterance) {
            speechSynthesis.speak(currentUtterance);
          }
        }, 100);
      }
    };
    
    const handleMouseLeave = (): void => {
      // Cancel speech when mouse leaves
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      currentUtterance = null;
    };
    
    // First, clean up any existing listeners
    const existingElements = document.querySelectorAll('[data-accessibility-listener]');
    existingElements.forEach(element => {
      element.removeAttribute('data-accessibility-listener');
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    });
    
    // Add event listeners to all elements
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      // Mark element as having listener to avoid duplicates
      element.setAttribute('data-accessibility-listener', 'true');
      element.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      element.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    });
    
    // Cleanup function
    return () => {
      const elementsWithListeners = document.querySelectorAll('[data-accessibility-listener]');
      elementsWithListeners.forEach(element => {
        element.removeAttribute('data-accessibility-listener');
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      currentUtterance = null;
    };
  }, []);

  // Enhanced reset settings - force disable everything
  const resetSettings = useCallback((): void => {
    // First clear all effects immediately
    clearAllEffects();
    
    const defaultSettings: AccessibilitySettings = {
      enabled: false, // Make sure this is false
      fontSize: 100,
      contrast: 'normal',
      brightness: 100,
      saturation: 100,
      invertColors: false,
      grayscale: false,
      cursorSize: 'normal',
      clickAnimation: false,
      pauseAnimations: false,
      readingGuide: false,
      focusMode: false,
      simplifyContent: false,
      soundEnabled: true,
      textToSpeech: false,
      keyboardNavigation: true,
      skipLinks: true
    };
    
    setSettings(defaultSettings);
    
    // Also clear from localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('accessibility-settings');
      } catch (error) {
        console.warn('Failed to clear accessibility settings:', error);
      }
    }
    
    // Force another cleanup after state update
    setTimeout(() => {
      clearAllEffects();
    }, 100);
  }, [clearAllEffects]);

  const toggleSetting = useCallback((key: keyof AccessibilitySettings): void => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ): void => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const speakText = useCallback((text: string): void => {
    // Only speak if accessibility is enabled AND text-to-speech is enabled
    if (!settings.enabled || !settings.textToSpeech) return;
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.volume = 0.7;
      utterance.lang = 'id-ID';
      speechSynthesis.speak(utterance);
    }
  }, [settings.enabled, settings.textToSpeech]); // Add enabled dependency

  const SettingButton: React.FC<SettingButtonProps> = ({ 
    icon: Icon, 
    label, 
    active, 
    onClick, 
    onMouseEnter,
    disabled = false 
  }) => (
    <button
      onClick={onClick}
      onMouseEnter={() => onMouseEnter && !disabled && speakText(label)}
      disabled={disabled}
      className={`
        flex items-center space-x-2 w-full p-3 rounded-lg transition-all duration-200
        ${disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50' 
          : active 
            ? 'bg-blue-500 text-white shadow-lg' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
      aria-pressed={active}
      aria-label={label}
      aria-disabled={disabled}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  const SliderControl: React.FC<SliderControlProps> = ({ 
    label, 
    value, 
    min, 
    max, 
    step, 
    onChange, 
    unit = '',
    disabled = false 
  }) => (
    <div className={`space-y-2 ${disabled ? 'opacity-50' : ''}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}: {value}{unit}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider disabled:cursor-not-allowed"
        aria-label={`${label} control`}
      />
    </div>
  );

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-200 z-50 
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${settings.enabled 
            ? 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500' 
            : 'bg-brand-500 hover:bg-brand-600 text-white focus:ring-brand-500'
          }
        `}
        aria-label={`${settings.enabled ? 'Accessibility enabled' : 'Accessibility disabled'} - Toggle accessibility settings`}
        onMouseEnter={() => speakText('Pengaturan Aksesibilitas')}
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {/* Overlay Panel */}
      {isOpen && (
        <div id="accessibility-overlay" className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Pengaturan Aksesibilitas
                </h2>
                {/* Master Toggle */}
                <button
                  onClick={() => toggleSetting('enabled')}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${settings.enabled 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${settings.enabled ? 'focus:ring-green-500' : 'focus:ring-gray-500'}
                  `}
                  aria-label={`${settings.enabled ? 'Disable' : 'Enable'} accessibility features`}
                  onMouseEnter={() => speakText(settings.enabled ? 'Matikan Aksesibilitas' : 'Aktifkan Aksesibilitas')}
                >
                  {settings.enabled ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                  <span className="text-sm">
                    {settings.enabled ? 'Aktif' : 'Nonaktif'}
                  </span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetSettings}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                  aria-label="Reset all settings"
                  onMouseEnter={() => speakText('Reset Semua Pengaturan')}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                  aria-label="Close accessibility settings"
                  onMouseEnter={() => speakText('Tutup Pengaturan')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Status Indicator */}
            {!settings.enabled && (
              <div className="mx-6 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <PowerOff className="w-5 h-5 text-yellow-600" />
                  <p className="text-yellow-800 text-sm font-medium">
                    Fitur aksesibilitas sedang nonaktif. Aktifkan untuk menggunakan semua fitur.
                  </p>
                </div>
              </div>
            )}

            {settings.enabled && (
              <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Power className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 text-sm font-medium">
                    ✓ Fitur aksesibilitas aktif dan akan tersimpan saat ganti halaman.
                  </p>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Visual Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Pengaturan Visual
                </h3>
                
                <SliderControl
                  label="Ukuran Font"
                  value={settings.fontSize}
                  min={50}
                  max={200}
                  step={10}
                  unit="%"
                  onChange={(value) => updateSetting('fontSize', value)}
                  disabled={!settings.enabled}
                />
                
                <SliderControl
                  label="Kecerahan"
                  value={settings.brightness}
                  min={50}
                  max={150}
                  step={10}
                  unit="%"
                  onChange={(value) => updateSetting('brightness', value)}
                  disabled={!settings.enabled}
                />
                
                <SliderControl
                  label="Saturasi"
                  value={settings.saturation}
                  min={0}
                  max={200}
                  step={10}
                  unit="%"
                  onChange={(value) => updateSetting('saturation', value)}
                  disabled={!settings.enabled}
                />
                
                <div className={`space-y-2 ${!settings.enabled ? 'opacity-50' : ''}`}>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kontras
                  </label>
                  <select
                    value={settings.contrast}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateSetting('contrast', e.target.value as AccessibilitySettings['contrast'])}
                    disabled={!settings.enabled}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">Tinggi</option>
                  </select>
                </div>
                
                <SettingButton
                  icon={Palette}
                  label="Balik Warna"
                  active={settings.invertColors}
                  onClick={() => toggleSetting('invertColors')}
                  onMouseEnter={() => speakText('Balik Warna')}
                  disabled={!settings.enabled}
                />
                
                <SettingButton
                  icon={Contrast}
                  label="Grayscale"
                  active={settings.grayscale}
                  onClick={() => toggleSetting('grayscale')}
                  onMouseEnter={() => speakText('Grayscale')}
                  disabled={!settings.enabled}
                />
              </div>

              {/* Motor & Navigation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <MousePointer className="w-5 h-5 mr-2" />
                  Navigasi & Motor
                </h3>
                
                <div className={`space-y-2 ${!settings.enabled ? 'opacity-50' : ''}`}>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ukuran Kursor
                  </label>
                  <select
                    value={settings.cursorSize}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateSetting('cursorSize', e.target.value as AccessibilitySettings['cursorSize'])}
                    disabled={!settings.enabled}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <option value="normal">Normal</option>
                    <option value="large">Besar</option>
                    <option value="extra">Ekstra Besar</option>
                  </select>
                </div>
                
                <SettingButton
                  icon={Keyboard}
                  label="Navigasi Keyboard"
                  active={settings.keyboardNavigation}
                  onClick={() => toggleSetting('keyboardNavigation')}
                  onMouseEnter={() => speakText('Navigasi Keyboard')}
                  disabled={!settings.enabled}
                />
                
                <SettingButton
                  icon={Focus}
                  label="Panduan Baca"
                  active={settings.readingGuide}
                  onClick={() => toggleSetting('readingGuide')}
                  onMouseEnter={() => speakText('Panduan Baca')}
                  disabled={!settings.enabled}
                />
                
                <SettingButton
                  icon={settings.pauseAnimations ? Play : Pause}
                  label={settings.pauseAnimations ? 'Mulai Animasi' : 'Hentikan Animasi'}
                  active={settings.pauseAnimations}
                  onClick={() => toggleSetting('pauseAnimations')}
                  onMouseEnter={() => speakText(settings.pauseAnimations ? 'Mulai Animasi' : 'Hentikan Animasi')}
                  disabled={!settings.enabled}
                />
                
                <SettingButton
                  icon={Move}
                  label="Animasi Klik"
                  active={settings.clickAnimation}
                  onClick={() => toggleSetting('clickAnimation')}
                  onMouseEnter={() => speakText('Animasi Klik')}
                  disabled={!settings.enabled}
                />
              </div>

              {/* Cognitive & Audio */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Kognitif & Audio
                </h3>
                
                <SettingButton
                  icon={settings.focusMode ? EyeOff : Eye}
                  label="Mode Fokus"
                  active={settings.focusMode}
                  onClick={() => toggleSetting('focusMode')}
                  onMouseEnter={() => speakText('Mode Fokus')}
                  disabled={!settings.enabled}
                />
                
                <SettingButton
                  icon={Type}
                  label="Sederhanakan Konten"
                  active={settings.simplifyContent}
                  onClick={() => toggleSetting('simplifyContent')}
                  onMouseEnter={() => speakText('Sederhanakan Konten')}
                  disabled={!settings.enabled}
                />
                
                <SettingButton
                  icon={settings.soundEnabled ? Volume2 : VolumeX}
                  label={settings.soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
                  active={settings.soundEnabled}
                  onClick={() => toggleSetting('soundEnabled')}
                  onMouseEnter={() => speakText(settings.soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara')}
                  disabled={!settings.enabled}
                />
                
                <SettingButton
                  icon={Volume2}
                  label="Text-to-Speech"
                  active={settings.textToSpeech}
                  onClick={() => toggleSetting('textToSpeech')}
                  onMouseEnter={() => speakText('Text-to-Speech untuk semua elemen')}
                  disabled={!settings.enabled}
                />
                
                {settings.textToSpeech && settings.enabled && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-xs">
                      💡 Arahkan kursor ke elemen apapun untuk mendengar teksnya
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Pengaturan tersimpan otomatis di browser</p>
                  <p className="mt-1">Gunakan Tab untuk navigasi keyboard</p>
                  <p className="mt-1">Pengaturan akan tetap aktif saat ganti halaman</p>
                  {settings.enabled && (
                    <p className="mt-1 text-green-600 font-medium">✓ Fitur aksesibilitas aktif</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={resetSettings}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onMouseEnter={() => speakText('Reset Semua Pengaturan')}
                  >
                    Reset Semua
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onMouseEnter={() => speakText('Tutup Panel')}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles - STRICT conditional rendering */}
      <style jsx global>{`
        :root {
          --accessibility-font-scale: 1;
          --cursor-scale: 1;
        }
        
        ${settings.enabled ? `
          :root {
            --accessibility-font-scale: ${settings.fontSize / 100};
          }
          
          * {
            font-size: calc(1rem * var(--accessibility-font-scale)) !important;
          }
          
          ${settings.focusMode ? `
            .focus-mode * {
              outline: 2px solid #3b82f6 !important;
              outline-offset: 2px !important;
            }
          ` : ''}
        ` : `
          /* When disabled, ensure NO accessibility styles are applied */
          * {
            font-size: initial !important;
          }
          
          html {
            filter: none !important;
          }
          
          body {
            filter: none !important;
          }
        `}
        
        .slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        
        .slider::-webkit-slider-track {
          background: #d1d5db;
          border-radius: 9999px;
          height: 8px;
        }
        
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-track {
          background: #d1d5db;
          border-radius: 9999px;
          height: 8px;
          border: none;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .slider:disabled::-webkit-slider-thumb {
          cursor: not-allowed;
          background: #9ca3af;
        }
        
        .slider:disabled::-moz-range-thumb {
          cursor: not-allowed;
          background: #9ca3af;
        }
        
        /* Screen reader only class */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </>
  );
};

export default AccessibilityOverlay;