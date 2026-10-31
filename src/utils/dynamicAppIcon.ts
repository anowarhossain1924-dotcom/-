/**
 * Dynamic App Icon & PWA WebApp Manifest Synchronizer
 * Ensures that whichever logo the Admin provides or uploads is used as:
 * 1. The browser tab favicon (rel="icon", rel="shortcut icon")
 * 2. The iOS Apple Touch Icon (rel="apple-touch-icon")
 * 3. The PWA install icon on Android & Desktop (via dynamic manifest update)
 * 4. The social share OpenGraph image (meta property="og:image")
 */

export interface GeneratedIcons {
  icon192: string;
  icon512: string;
  iconMaskable: string;
}

const CACHE_KEY = 'adarsha_dynamic_icons_cache_v2';
let currentBlobUrl: string | null = null;

/**
 * Loads image and renders compliant 192x192, 512x512, and maskable PNG icons using HTML Canvas.
 */
export async function generateAppIcons(sourceUrl: string): Promise<GeneratedIcons | null> {
  if (!sourceUrl || sourceUrl.trim() === '') {
    return null;
  }

  // Check cache first for faster load
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.sourceUrl === sourceUrl && parsed.icons) {
        return parsed.icons;
      }
    }
  } catch (e) {
    // Ignore cache error
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const fallbackToRawUrl = () => {
      const fallbackIcons: GeneratedIcons = {
        icon192: sourceUrl,
        icon512: sourceUrl,
        iconMaskable: sourceUrl,
      };
      saveToCache(sourceUrl, fallbackIcons);
      resolve(fallbackIcons);
    };

    const timeout = setTimeout(() => {
      fallbackToRawUrl();
    }, 4500);

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const nw = img.naturalWidth || 512;
        const nh = img.naturalHeight || 512;

        // 1. Generate 192x192 Standard Icon
        const canvas192 = document.createElement('canvas');
        canvas192.width = 192;
        canvas192.height = 192;
        const ctx192 = canvas192.getContext('2d');
        if (ctx192) {
          ctx192.clearRect(0, 0, 192, 192);
          const maxDim = 180;
          const scale = Math.min(maxDim / nw, maxDim / nh);
          const w = nw * scale;
          const h = nh * scale;
          const x = (192 - w) / 2;
          const y = (192 - h) / 2;
          ctx192.drawImage(img, x, y, w, h);
        }
        const icon192 = canvas192.toDataURL('image/png');

        // 2. Generate 512x512 Standard High-Res Icon
        const canvas512 = document.createElement('canvas');
        canvas512.width = 512;
        canvas512.height = 512;
        const ctx512 = canvas512.getContext('2d');
        if (ctx512) {
          ctx512.clearRect(0, 0, 512, 512);
          const maxDim = 480;
          const scale = Math.min(maxDim / nw, maxDim / nh);
          const w = nw * scale;
          const h = nh * scale;
          const x = (512 - w) / 2;
          const y = (512 - h) / 2;
          ctx512.drawImage(img, x, y, w, h);
        }
        const icon512 = canvas512.toDataURL('image/png');

        // 3. Generate 512x512 Maskable Icon for Android Home Screen (Safe Zone with crisp backdrop)
        const canvasMaskable = document.createElement('canvas');
        canvasMaskable.width = 512;
        canvasMaskable.height = 512;
        const ctxMaskable = canvasMaskable.getContext('2d');
        if (ctxMaskable) {
          // Fill background with elegant school navy or clean white
          ctxMaskable.fillStyle = '#ffffff';
          ctxMaskable.fillRect(0, 0, 512, 512);

          // Subtle rounded border container for maskable safety
          ctxMaskable.fillStyle = '#f8fafc';
          ctxMaskable.beginPath();
          ctxMaskable.arc(256, 256, 240, 0, Math.PI * 2);
          ctxMaskable.fill();

          // Safe zone inside 512 is 80% (approx 400px diameter)
          const maxDim = 380;
          const scale = Math.min(maxDim / nw, maxDim / nh);
          const w = nw * scale;
          const h = nh * scale;
          const x = (512 - w) / 2;
          const y = (512 - h) / 2;
          ctxMaskable.drawImage(img, x, y, w, h);
        }
        const iconMaskable = canvasMaskable.toDataURL('image/png');

        const result: GeneratedIcons = { icon192, icon512, iconMaskable };
        saveToCache(sourceUrl, result);
        resolve(result);
      } catch (err) {
        console.warn('Canvas processing fallback (CORS or security restriction):', err);
        fallbackToRawUrl();
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      fallbackToRawUrl();
    };

    img.src = sourceUrl;
  });
}

function saveToCache(sourceUrl: string, icons: GeneratedIcons) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        sourceUrl,
        icons,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    // Quota exceeded fallback
  }
}

/**
 * Updates DOM link tags and dynamic manifest to apply the admin's chosen logo as the app icon.
 */
export function applyAppIconsAndManifest(icons: GeneratedIcons | null, originalLogoUrl?: string) {
  if (typeof document === 'undefined') return;

  // 1. Favicon (browser tabs)
  let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  favicon.href = icons ? icons.icon192 : '/icon.svg';
  favicon.type = icons ? 'image/png' : 'image/svg+xml';

  // 2. Shortcut Icon (legacy browsers)
  let shortcut = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement | null;
  if (!shortcut) {
    shortcut = document.createElement('link');
    shortcut.rel = 'shortcut icon';
    document.head.appendChild(shortcut);
  }
  shortcut.href = icons ? icons.icon192 : '/favicon.ico';

  // 3. Alternate Icon
  const alternateIcon = document.querySelector("link[rel='alternate icon']") as HTMLLinkElement | null;
  if (alternateIcon) {
    alternateIcon.href = icons ? icons.icon192 : '/pwa-192x192.png';
  }

  // 4. Apple Touch Icon (iOS home screen & Safari bookmarks)
  let appleIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
  if (!appleIcon) {
    appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    document.head.appendChild(appleIcon);
  }
  appleIcon.href = icons ? icons.icon192 : '/apple-touch-icon.png';

  // 5. OpenGraph Image for social shares
  const ogImage = document.querySelector("meta[property='og:image']") as HTMLMetaElement | null;
  if (ogImage) {
    ogImage.content = icons ? (originalLogoUrl || icons.icon512) : '/pwa-512x512.png';
  }

  // 6. Dynamic WebApp Manifest for Android & Desktop App Installation
  let manifestLink = document.querySelector("link[rel='manifest']") as HTMLLinkElement | null;
  if (!manifestLink) {
    manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    document.head.appendChild(manifestLink);
  }

  if (!icons) {
    // Admin cleared or reset to default logo
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
      currentBlobUrl = null;
    }
    manifestLink.href = '/manifest.webmanifest';
    return;
  }

  // Build dynamic manifest using admin's active logo
  const manifestData = {
    id: '/',
    name: 'আদর্শ শিশু কানন স্কুল ',
    short_name: 'আদর্শ শিশু কানন স্কুল ',
    description: 'কাশিম বাজার, সুন্দরগঞ্জ, গাইবান্ধার আদর্শ শিশু কানন স্কুলের অফিসিয়াল প্ল্যাটফর্ম ও ওয়েব অ্যাপ',
    theme_color: '#1e3a8a',
    background_color: '#1e3a8a',
    display: 'standalone',
    orientation: 'portrait-primary',
    start_url: '/',
    scope: '/',
    icons: [
      {
        src: icons.icon192,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: icons.icon512,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: icons.iconMaskable,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };

  try {
    const blob = new Blob([JSON.stringify(manifestData, null, 2)], {
      type: 'application/manifest+json',
    });
    const newBlobUrl = URL.createObjectURL(blob);
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
    }
    currentBlobUrl = newBlobUrl;
    manifestLink.href = newBlobUrl;
  } catch (err) {
    manifestLink.href = 'data:application/manifest+json;utf8,' + encodeURIComponent(JSON.stringify(manifestData));
  }
}
