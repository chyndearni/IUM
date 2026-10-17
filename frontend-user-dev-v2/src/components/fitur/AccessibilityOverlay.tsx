"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Eye,
  EyeOff,
  Type,
  Contrast,
  Volume2,
  VolumeX,
  X,
  RotateCcw,
  Palette,
  Power,
  PowerOff,
  Accessibility,
  Sun,
  Moon,
  Minus,
  Plus,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface LowVisionSettings {
  // Master Switch
  enabled: boolean;

  // Font & Text
  fontSize: number;
  fontWeight: "normal" | "bold" | "bolder";
  lineHeight: number;
  letterSpacing: number;

  // Contrast & Colors
  contrast: "normal" | "high" | "higher";
  brightness: number;
  invertColors: boolean;
  grayscale: boolean;

  // High Contrast Themes
  highContrastTheme: "none" | "yellow-black" | "white-black" | "blue-white";

  // Magnification
  magnification: number;
  magnifierEnabled: boolean;

  // Audio Support
  soundEnabled: boolean;
  textToSpeech: boolean;
  ttsRate: number;
  ttsVolume: number;
  ttsVoice: string;

  // Focus & Navigation
  focusIndicator: boolean;
  largeClickTargets: boolean;
}

interface SettingButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
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
  showValue?: boolean;
}

const LowVisionAccessibility: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const cleanupFunctionsRef = useRef<(() => void)[]>([]);
  const lastSpokenTextRef = useRef<string>("");
  const speakTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load settings from memory (no localStorage)
  const [settings, setSettings] = useState<LowVisionSettings>(() => {
    const defaultSettings: LowVisionSettings = {
      enabled: false,
      fontSize: 100,
      fontWeight: "normal",
      lineHeight: 150,
      letterSpacing: 0,
      contrast: "normal",
      brightness: 100,
      invertColors: false,
      grayscale: false,
      highContrastTheme: "none",
      magnification: 100,
      magnifierEnabled: false,
      soundEnabled: true,
      textToSpeech: false,
      ttsRate: 1,
      ttsVolume: 0.9,
      ttsVoice: "",
      focusIndicator: true,
      largeClickTargets: false,
    };

    return defaultSettings;
  });

  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load TTS voices
  useEffect(() => {
    if (!isClient || !("speechSynthesis" in window)) return;

    const loadVoices = (): void => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      if (voices.length > 0 && !settings.ttsVoice) {
        const preferred =
          voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("id")) ||
          voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("en")) ||
          voices[0];
        if (preferred) {
          setSettings((prev) => ({ ...prev, ttsVoice: preferred.name }));
        }
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [isClient, settings.ttsVoice]);

  // Clear all effects
  const clearAllEffects = useCallback((): void => {
    if (!isClient) return;

    const root = document.documentElement;
    root.style.removeProperty("--lv-font-scale");
    root.style.removeProperty("--lv-font-weight");
    root.style.removeProperty("--lv-line-height");
    root.style.removeProperty("--lv-letter-spacing");
    root.style.removeProperty("--lv-magnification");
    root.style.filter = "";

    root.classList.remove(
      "lv-high-contrast-yellow-black",
      "lv-high-contrast-white-black",
      "lv-high-contrast-blue-white",
      "lv-focus-indicator",
      "lv-large-targets"
    );

    cleanupFunctionsRef.current.forEach((cleanup) => cleanup());
    cleanupFunctionsRef.current = [];

    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }

    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }
  }, [isClient]);

  // Text to speech functionality
  const enableTextToSpeech = useCallback((): (() => void) | null => {
    if (!isClient || !("speechSynthesis" in window)) return null;

    const getTextFromElement = (element: HTMLElement): string => {
      if (element.tagName === "IMG") {
        const img = element as HTMLImageElement;
        return img.alt || img.title || "Gambar";
      }

      if (element.tagName === "BUTTON") {
        return (
          element.textContent?.trim() ||
          element.getAttribute("aria-label") ||
          "Tombol"
        );
      }

      if (element.tagName === "A") {
        return (
          element.textContent?.trim() || element.getAttribute("title") || "Link"
        );
      }

      if (element.tagName === "INPUT") {
        const input = element as HTMLInputElement;
        return (
          input.placeholder || input.getAttribute("aria-label") || "Input field"
        );
      }

      const text = element.textContent?.trim();
      return text ? text.substring(0, 200) : "";
    };

    const speakText = (text: string): void => {
      if (!settings.soundEnabled || !text || text === lastSpokenTextRef.current)
        return;

      // Cancel previous speech
      speechSynthesis.cancel();

      // Clear any pending timeout
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
      }

      // Set timeout to prevent too rapid speech
      speakTimeoutRef.current = setTimeout(() => {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = settings.ttsRate;
          utterance.volume = settings.ttsVolume;

          const voices = speechSynthesis.getVoices();
          const selectedVoice =
            settings.ttsVoice &&
            voices.find((v) => v.name === settings.ttsVoice);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }

          // Add error handling
          utterance.onerror = (event) => {
            console.warn("Speech synthesis error:", event);
          };

          utterance.onend = () => {
            lastSpokenTextRef.current = "";
          };

          speechSynthesis.speak(utterance);
          lastSpokenTextRef.current = text;
        } catch (error) {
          console.warn("Speech synthesis failed:", error);
        }
      }, 100); // Small delay to prevent rapid-fire speech
    };

    const handleMouseOver = (e: Event): void => {
      const target = e.target as HTMLElement;
      if (!target || target.closest(".accessibility-overlay")) return;

      // Skip if element is too small or likely decorative
      const rect = target.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return;

      const text = getTextFromElement(target);
      if (text && text.length > 1) {
        speakText(text);
      }
    };

    const handleFocus = (e: Event): void => {
      const target = e.target as HTMLElement;
      if (!target || target.closest(".accessibility-overlay")) return;

      const text = getTextFromElement(target);
      if (text && text.length > 1) {
        speakText(text);
      }
    };

    const handleClick = (e: Event): void => {
      const target = e.target as HTMLElement;
      if (!target || target.closest(".accessibility-overlay")) return;

      const text = getTextFromElement(target);
      if (text && text.length > 1) {
        // Immediate speech for clicks
        speechSynthesis.cancel();
        try {
          const utterance = new SpeechSynthesisUtterance(`Mengklik ${text}`);
          utterance.rate = settings.ttsRate;
          utterance.volume = settings.ttsVolume;

          const voices = speechSynthesis.getVoices();
          const selectedVoice =
            settings.ttsVoice &&
            voices.find((v) => v.name === settings.ttsVoice);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }

          speechSynthesis.speak(utterance);
        } catch (error) {
          console.warn("Click speech failed:", error);
        }
      }
    };

    // Add event listeners with passive: false for better performance
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("focusin", handleFocus, { passive: true });
    document.addEventListener("click", handleClick, { passive: true });

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("click", handleClick);
      speechSynthesis.cancel();
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
        speakTimeoutRef.current = null;
      }
    };
  }, [
    isClient,
    settings.soundEnabled,
    settings.ttsRate,
    settings.ttsVolume,
    settings.ttsVoice,
  ]);

  // Apply settings
  useEffect(() => {
    if (!isClient) return;

    clearAllEffects();

    if (!settings.enabled) return;

    const root = document.documentElement;

    // Font settings
    if (settings.fontSize !== 100) {
      root.style.setProperty("--lv-font-scale", `${settings.fontSize / 100}`);
    }

    if (settings.fontWeight !== "normal") {
      root.style.setProperty("--lv-font-weight", settings.fontWeight);
    }

    if (settings.lineHeight !== 150) {
      root.style.setProperty(
        "--lv-line-height",
        `${settings.lineHeight / 100}`
      );
    }

    if (settings.letterSpacing !== 0) {
      root.style.setProperty(
        "--lv-letter-spacing",
        `${settings.letterSpacing}px`
      );
    }

    // Magnification
    if (settings.magnification !== 100) {
      root.style.setProperty(
        "--lv-magnification",
        `${settings.magnification / 100}`
      );
    }

    // Visual filters
    const filters: string[] = [];
    if (settings.contrast === "high") filters.push("contrast(150%)");
    if (settings.contrast === "higher") filters.push("contrast(200%)");
    if (settings.brightness !== 100)
      filters.push(`brightness(${settings.brightness}%)`);
    if (settings.invertColors) filters.push("invert(1)");
    if (settings.grayscale) filters.push("grayscale(1)");

    if (filters.length > 0) {
      root.style.filter = filters.join(" ");
    }

    // High contrast themes
    if (settings.highContrastTheme !== "none") {
      root.classList.add(`lv-high-contrast-${settings.highContrastTheme}`);
    }

    // Focus indicator
    if (settings.focusIndicator) {
      root.classList.add("lv-focus-indicator");
    }

    // Large click targets
    if (settings.largeClickTargets) {
      root.classList.add("lv-large-targets");
    }

    // Text to speech
    if (settings.textToSpeech) {
      const cleanup = enableTextToSpeech();
      if (cleanup) cleanupFunctionsRef.current.push(cleanup);
    }
  }, [settings, isClient, clearAllEffects, enableTextToSpeech]);

  const resetSettings = useCallback((): void => {
    clearAllEffects();
    const defaultSettings: LowVisionSettings = {
      enabled: false,
      fontSize: 100,
      fontWeight: "normal",
      lineHeight: 150,
      letterSpacing: 0,
      contrast: "normal",
      brightness: 100,
      invertColors: false,
      grayscale: false,
      highContrastTheme: "none",
      magnification: 100,
      magnifierEnabled: false,
      soundEnabled: true,
      textToSpeech: false,
      ttsRate: 1,
      ttsVolume: 0.9,
      ttsVoice: "",
      focusIndicator: true,
      largeClickTargets: false,
    };
    setSettings(defaultSettings);
  }, [clearAllEffects]);

  const toggleSetting = useCallback((key: keyof LowVisionSettings): void => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const updateSetting = useCallback(
    <K extends keyof LowVisionSettings>(
      key: K,
      value: LowVisionSettings[K]
    ): void => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const SettingButton: React.FC<SettingButtonProps> = ({
    icon: Icon,
    label,
    active,
    onClick,
    disabled = false,
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center space-x-3 w-full p-4 rounded-lg transition-all duration-200 text-left
        ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
            : active
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
      aria-pressed={active}
      aria-label={label}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const SliderControl: React.FC<SliderControlProps> = ({
    label,
    value,
    min,
    max,
    step,
    onChange,
    unit = "",
    disabled = false,
    showValue = true,
  }) => (
    <div className={`space-y-3 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex justify-between items-center">
        <label className="font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {showValue && (
          <span className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {value}
            {unit}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={disabled || value <= min}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Kurangi ${label}`}
        >
          <Minus className="w-4 h-4 text-gray-700 dark:text-white" />
        </button>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="slider flex-1 h-4 bg-transparent appearance-none cursor-pointer"
          aria-label={`${label} control`}
        />
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={disabled || value >= max}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Tambah ${label}`}
        >
          <Plus className="w-4 h-4 text-gray-700 dark:text-white" />
        </button>
      </div>
    </div>
  );

  // Generate dynamic styles
  const generateDynamicStyles = () => {
    if (!isClient || !settings.enabled) return "";

    return `
      /* Font & text adjustments - Exclude html/body and accessibility components */
      *:not(html):not(body):not(.accessibility-overlay):not(.accessibility-overlay *):not(.low-vision-sidebar):not(.low-vision-sidebar *) {
        font-size: calc(1rem * var(--lv-font-scale)) !important;
        font-weight: var(--lv-font-weight) !important;
        line-height: var(--lv-line-height) !important;
        letter-spacing: var(--lv-letter-spacing) !important;
      }

      /* Page magnification - Exclude accessibility components */
      body > *:not(.accessibility-overlay):not(.low-vision-sidebar) {
        zoom: var(--lv-magnification);
      }

      /* High contrast themes - Exclude accessibility components */
      .lv-high-contrast-yellow-black *:not(.accessibility-overlay):not(.accessibility-overlay *):not(.low-vision-sidebar):not(.low-vision-sidebar *) {
        background-color: #000000 !important;
        color: #ffff00 !important;
        border-color: #ffff00 !important;
      }

      .lv-high-contrast-white-black *:not(.accessibility-overlay):not(.accessibility-overlay *):not(.low-vision-sidebar):not(.low-vision-sidebar *) {
        background-color: #000000 !important;
        color: #ffffff !important;
        border-color: #ffffff !important;
      }

      .lv-high-contrast-blue-white *:not(.accessibility-overlay):not(.accessibility-overlay *):not(.low-vision-sidebar):not(.low-vision-sidebar *) {
        background-color: #ffffff !important;
        color: #0000ff !important;
        border-color: #0000ff !important;
      }

      /* Focus indicators - Exclude accessibility components */
      .lv-focus-indicator *:not(.accessibility-overlay):not(.accessibility-overlay *):not(.low-vision-sidebar):not(.low-vision-sidebar *):focus {
        outline: 4px solid #3b82f6 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.3) !important;
      }

      /* Large click targets - Exclude accessibility components */
      .lv-large-targets *:not(.accessibility-overlay):not(.accessibility-overlay *):not(.low-vision-sidebar):not(.low-vision-sidebar *) button,
      .lv-large-targets *:not(.accessibility-overlay):not(.accessibility-overlay *):not(.low-vision-sidebar):not(.low-vision-sidebar *) a,
      .lv-large-targets *:not(.accessibility-overlay):not(.accessibility-overlay *):not(.low-vision-sidebar):not(.low-vision-sidebar *) input,
      .lv-large-targets *:not(.accessibility-overlay):not(.accessibility-overlay *):not(.low-vision-sidebar):not(.low-vision-sidebar *) select,
      .lv-large-targets *:not(.accessibility-overlay):not(.accessibility-overlay *):not(.low-vision-sidebar):not(.low-vision-sidebar *) textarea {
        min-height: 44px !important;
        min-width: 44px !important;
        padding: 12px !important;
      }

      .lv-large-targets *:not(.accessibility-overlay):not(.accessibility-overlay *):not(.low-vision-sidebar):not(.low-vision-sidebar *) button {
        font-size: 18px !important;
        font-weight: bold !important;
      }
    `;
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          accessibility-overlay fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-200 z-40
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${
            settings.enabled
              ? "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500"
              : "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500"
          }
        `}
        aria-label="Buka pengaturan aksesibilitas low vision"
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      {isOpen && (
        <div className="accessibility-overlay low-vision-sidebar fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-9999 transform transition-transform duration-300 ease-in-out overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-blue-700 bg-blue-600">
            <div className="flex items-center space-x-3">
              <Accessibility className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Aksesibilitas</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Tutup sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Master Toggle */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toggleSetting("enabled")}
              className={`
                flex items-center justify-between w-full p-4 rounded-lg font-medium transition-all duration-200
                ${
                  settings.enabled
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  settings.enabled
                    ? "focus:ring-green-500"
                    : "focus:ring-gray-500"
                }
              `}
              aria-label={`${
                settings.enabled ? "Matikan" : "Aktifkan"
              } fitur aksesibilitas`}
            >
              <div className="flex items-center space-x-3">
                {settings.enabled ? (
                  <Power className="w-5 h-5" />
                ) : (
                  <PowerOff className="w-5 h-5" />
                )}
                <span>
                  {settings.enabled ? "Fitur Aktif" : "Fitur Nonaktif"}
                </span>
              </div>
            </button>
          </div>

          {/* Settings Content */}
          <div className="p-6 space-y-8">
            {/* Font & Text */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2" />
                Teks & Font
              </h3>
              <div className="space-y-6">
                <SliderControl
                  label="Ukuran Font"
                  value={settings.fontSize}
                  min={50}
                  max={300}
                  step={10}
                  unit="%"
                  onChange={(value) => updateSetting("fontSize", value)}
                  disabled={!settings.enabled}
                />

                <SliderControl
                  label="Tinggi Baris"
                  value={settings.lineHeight}
                  min={100}
                  max={300}
                  step={10}
                  unit="%"
                  onChange={(value) => updateSetting("lineHeight", value)}
                  disabled={!settings.enabled}
                />

                <SliderControl
                  label="Jarak Huruf"
                  value={settings.letterSpacing}
                  min={0}
                  max={5}
                  step={0.5}
                  unit="px"
                  onChange={(value) => updateSetting("letterSpacing", value)}
                  disabled={!settings.enabled}
                />

                <div
                  className={`space-y-2 ${
                    !settings.enabled ? "opacity-50" : ""
                  }`}
                >
                  <label className="font-medium text-gray-700 dark:text-gray-300">
                    Ketebalan Font
                  </label>
                  <select
                    value={settings.fontWeight}
                    onChange={(e) =>
                      updateSetting(
                        "fontWeight",
                        e.target.value as LowVisionSettings["fontWeight"]
                      )
                    }
                    disabled={!settings.enabled}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Tebal</option>
                    <option value="bolder">Ekstra Tebal</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Visual & Contrast */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Contrast className="w-5 h-5 mr-2" />
                Visual & Kontras
              </h3>
              <div className="space-y-6">
                <SliderControl
                  label="Kecerahan"
                  value={settings.brightness}
                  min={50}
                  max={200}
                  step={10}
                  unit="%"
                  onChange={(value) => updateSetting("brightness", value)}
                  disabled={!settings.enabled}
                />

                <div
                  className={`space-y-2 ${
                    !settings.enabled ? "opacity-50" : ""
                  }`}
                >
                  <label className="font-medium text-gray-700 dark:text-gray-300">
                    Tema Kontras Tinggi
                  </label>
                  <select
                    value={settings.highContrastTheme}
                    onChange={(e) =>
                      updateSetting(
                        "highContrastTheme",
                        e.target.value as LowVisionSettings["highContrastTheme"]
                      )
                    }
                    disabled={!settings.enabled}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="none">Tidak Ada</option>
                    <option value="yellow-black">Kuning pada Hitam</option>
                    <option value="white-black">Putih pada Hitam</option>
                    <option value="blue-white">Biru pada Putih</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <SettingButton
                    icon={Palette}
                    label="Balik Warna"
                    active={settings.invertColors}
                    onClick={() => toggleSetting("invertColors")}
                    disabled={!settings.enabled}
                  />

                  <SettingButton
                    icon={Moon}
                    label="Mode Grayscale"
                    active={settings.grayscale}
                    onClick={() => toggleSetting("grayscale")}
                    disabled={!settings.enabled}
                  />
                </div>
              </div>
            </section>

            {/* Magnification */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <ZoomIn className="w-5 h-5 mr-2" />
                Pembesaran
              </h3>
              <div className="space-y-6">
                <SliderControl
                  label="Tingkat Zoom"
                  value={settings.magnification}
                  min={100}
                  max={400}
                  step={25}
                  unit="%"
                  onChange={(value) => updateSetting("magnification", value)}
                  disabled={!settings.enabled}
                />
              </div>
            </section>

            {/* Audio Support */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Volume2 className="w-5 h-5 mr-2" />
                Dukungan Audio
              </h3>
              <div className="space-y-6">
                <SettingButton
                  icon={settings.soundEnabled ? Volume2 : VolumeX}
                  label={
                    settings.soundEnabled ? "Suara Aktif" : "Suara Nonaktif"
                  }
                  active={settings.soundEnabled}
                  onClick={() => toggleSetting("soundEnabled")}
                  disabled={!settings.enabled}
                />

                <SettingButton
                  icon={Volume2}
                  label="Text-to-Speech"
                  active={settings.textToSpeech}
                  onClick={() => toggleSetting("textToSpeech")}
                  disabled={!settings.enabled}
                />

                {settings.textToSpeech && settings.enabled && (
                  <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <SliderControl
                      label="Kecepatan Bicara"
                      value={settings.ttsRate}
                      min={0.5}
                      max={2}
                      step={0.1}
                      onChange={(value) => updateSetting("ttsRate", value)}
                      showValue={false}
                    />

                    <SliderControl
                      label="Volume"
                      value={Math.round(settings.ttsVolume * 100)}
                      min={0}
                      max={100}
                      step={10}
                      unit="%"
                      onChange={(value) =>
                        updateSetting("ttsVolume", value / 100)
                      }
                    />

                    {availableVoices.length > 0 && (
                      <div className="space-y-2">
                        <label className="font-medium text-blue-900 dark:text-blue-200">
                          Pilih Suara
                        </label>
                        <select
                          value={settings.ttsVoice || ""}
                          onChange={(e) =>
                            updateSetting("ttsVoice", e.target.value)
                          }
                          className="w-full p-2 border border-blue-200 dark:border-blue-800 rounded-lg bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-200"
                        >
                          {availableVoices.map((voice) => (
                            <option
                              key={`${voice.name}-${voice.lang}`}
                              value={voice.name}
                            >
                              {voice.name} ({voice.lang})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="text-sm text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                      💡 <strong>Tips:</strong> Arahkan mouse ke elemen atau
                      fokus dengan Tab untuk mendengar teks dibacakan.
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Navigation & Focus */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Accessibility className="w-5 h-5 mr-2" />
                Navigasi & Fokus
              </h3>
              <div className="space-y-4">
                <SettingButton
                  icon={Eye}
                  label="Indikator Fokus yang Jelas"
                  active={settings.focusIndicator}
                  onClick={() => toggleSetting("focusIndicator")}
                  disabled={!settings.enabled}
                />

                <SettingButton
                  icon={ZoomIn}
                  label="Target Klik Lebih Besar"
                  active={settings.largeClickTargets}
                  onClick={() => toggleSetting("largeClickTargets")}
                  disabled={!settings.enabled}
                />
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Pengaturan tersimpan dalam sesi ini</p>
                {settings.enabled && (
                  <p className="text-green-600 font-medium mt-1">
                    ✓ Fitur aksesibilitas aktif
                  </p>
                )}
                {settings.textToSpeech && settings.enabled && (
                  <p className="text-blue-600 font-medium mt-1">
                    🔊 Text-to-speech aktif
                  </p>
                )}
              </div>
              <button
                onClick={resetSettings}
                className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Semua Pengaturan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style jsx global>{`
        :root {
          --lv-font-scale: 1;
          --lv-font-weight: normal;
          --lv-line-height: 1.5;
          --lv-letter-spacing: 0px;
          --lv-magnification: 1;
        }

        /* Dynamic styles */
        ${generateDynamicStyles()}

        /* Accessibility overlay specific styles - Always applied to maintain accessibility components appearance */
        .accessibility-overlay {
          /* Reset all accessibility effects for accessibility components */
          zoom: 1 !important;
          filter: none !important;
          /* Stabilize typography in sidebar */
          font-size: 1rem !important;
          line-height: 1.5 !important;
          letter-spacing: 0px !important;
          font-weight: 400 !important;
        }

        .accessibility-overlay * {
          /* Fixed sizes for accessibility components elements */
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          letter-spacing: inherit !important;
          zoom: 1 !important;
          filter: none !important;
        }

        /* Ensure accessibility components background themes don't apply */
        .lv-high-contrast-yellow-black .accessibility-overlay,
        .lv-high-contrast-yellow-black .accessibility-overlay *,
        .lv-high-contrast-white-black .accessibility-overlay,
        .lv-high-contrast-white-black .accessibility-overlay *,
        .lv-high-contrast-blue-white .accessibility-overlay,
        .lv-high-contrast-blue-white .accessibility-overlay * {
          background-color: inherit !important;
          color: inherit !important;
          border-color: inherit !important;
        }

        /* Specific styles for floating button */
        .accessibility-overlay[class*="fixed"] {
          position: fixed !important;
          z-index: 40 !important;
        }

        /* Specific styles for sidebar */
        .accessibility-overlay.low-vision-sidebar {
          position: fixed !important;
          z-index: 50 !important;
        }

        /* Custom slider styles */
        .slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
          width: 100%;
          height: 24px; /* ruang untuk thumb */
        }

        .slider::-webkit-slider-track {
          background: #9ca3af; /* gray */
          border-radius: 9999px;
          height: 3px !important;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          margin-top: -10.5px; /* align thumb to 3px track (24/2 - 3/2) */
        }

        .slider::-moz-range-track {
          background: #9ca3af; /* gray */
          border-radius: 9999px;
          height: 3px !important;
          border: none;
        }

        /* Firefox progress (left side of thumb) */
        .slider::-moz-range-progress {
          background: #3b82f6;
          height: 3px !important;
          border-radius: 9999px;
        }

        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
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

        /* Edge/IE legacy -ms- prefixes ( harmless if ignored ) */
        .slider::-ms-track {
          width: 100%;
          height: 3px !important;
          cursor: pointer;
          background: transparent;
          border-color: transparent;
          color: transparent;
        }
        .slider::-ms-fill-lower {
          background: #3b82f6;
          border-radius: 9999px;
        }
        .slider::-ms-fill-upper {
          background: #9ca3af;
          border-radius: 9999px;
        }

        /* Dark mode variants for slider track & thumb borders */
        :root.dark .slider::-webkit-slider-track {
          background: #9ca3af; /* keep gray in dark for consistency */
          height: 3px !important;
        }
        :root.dark .slider::-moz-range-track {
          background: #9ca3af; /* keep gray in dark for consistency */
          height: 3px !important;
        }
        :root.dark .slider::-webkit-slider-thumb {
          border-color: #1f2937;
        }
        :root.dark .slider::-moz-range-thumb {
          border-color: #1f2937;
        }

        /* ===== WebKit (Chrome, Edge, Safari) ===== */
        .slider::-webkit-slider-runnable-track {
          background: #465fff;
          border-radius: 9999px;
          height: 3px !important;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #465fff; /* outline merah biar konsisten */
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          margin-top: -10.5px; /* selaraskan ke track 3px */
        }

        /* (Opsional) kompat alias lama—aman dibiarkan sama */
        .slider::-webkit-slider-track {
          background: #465fff;
          border-radius: 9999px;
          height: 3px !important;
        }

        /* ===== Firefox ===== */
        .slider::-moz-range-track {
          background: #465fff;
          border-radius: 9999px;
          height: 3px !important;
          border: none;
        }

        /* Progress (kiri dari thumb). Kalau ingin seluruh track merah, biarkan sama. */
        .slider::-moz-range-progress {
          background: #465fff;
          height: 3px !important;
          border-radius: 9999px;
        }

        /* Thumb Firefox */
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #465fff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Disabled state */
        .slider:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .slider:disabled::-webkit-slider-thumb,
        .slider:disabled::-moz-range-thumb {
          background: #9ca3af;
        }

        /* ===== (Opsional) Dark mode border thumb ===== */
        :root.dark .slider::-webkit-slider-thumb {
          border-color: #465fff;
        }
        :root.dark .slider::-moz-range-thumb {
          border-color: #465fff;
        }
      `}</style>
    </>
  );
};

export default LowVisionAccessibility;
