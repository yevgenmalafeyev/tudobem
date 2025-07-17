export type PlatformType = 'ios' | 'android' | 'desktop' | 'unknown';

export interface DeviceInfo {
  platform: PlatformType;
  browser: string;
  isMobile: boolean;
  canInstallPWA: boolean;
}

export function detectPlatform(): DeviceInfo {
  const userAgent = navigator.userAgent;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Check if already installed as PWA
  if (isStandalone) {
    return {
      platform: 'unknown',
      browser: 'PWA',
      isMobile: false,
      canInstallPWA: false
    };
  }

  // iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  if (isIOS) {
    const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS/.test(userAgent);
    return {
      platform: 'ios',
      browser: isSafari ? 'Safari' : 'Other',
      isMobile: true,
      canInstallPWA: isSafari
    };
  }

  // Android detection
  const isAndroid = /Android/.test(userAgent);
  if (isAndroid) {
    const isChrome = /Chrome/.test(userAgent) && !/Edge|OPR/.test(userAgent);
    const isFirefox = /Firefox/.test(userAgent);
    const isEdge = /Edge/.test(userAgent);
    
    let browser = 'Other';
    if (isChrome) browser = 'Chrome';
    else if (isFirefox) browser = 'Firefox';
    else if (isEdge) browser = 'Edge';
    
    return {
      platform: 'android',
      browser,
      isMobile: true,
      canInstallPWA: isChrome || isFirefox || isEdge
    };
  }

  // Desktop detection
  const isDesktop = !(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(userAgent));
  if (isDesktop) {
    const isChrome = /Chrome/.test(userAgent) && !/Edge|OPR/.test(userAgent);
    const isFirefox = /Firefox/.test(userAgent);
    const isEdge = /Edge/.test(userAgent);
    
    let browser = 'Other';
    if (isChrome) browser = 'Chrome';
    else if (isFirefox) browser = 'Firefox';
    else if (isEdge) browser = 'Edge';
    
    return {
      platform: 'desktop',
      browser,
      isMobile: false,
      canInstallPWA: isChrome || isFirefox || isEdge
    };
  }

  return {
    platform: 'unknown',
    browser: 'Unknown',
    isMobile: false,
    canInstallPWA: false
  };
}

export function checkPWASupport(): boolean {
  const deviceInfo = detectPlatform();
  return deviceInfo.canInstallPWA && !window.matchMedia('(display-mode: standalone)').matches;
}

export function isMobileDevice(): boolean {
  const deviceInfo = detectPlatform();
  return deviceInfo.isMobile;
}