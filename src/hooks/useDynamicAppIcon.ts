import { useState, useEffect } from 'react';
import { generateAppIcons, applyAppIconsAndManifest, GeneratedIcons } from '../utils/dynamicAppIcon';

export function useDynamicAppIcon(logoUrl?: string) {
  const [icons, setIcons] = useState<GeneratedIcons | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function syncIcons() {
      if (!logoUrl || logoUrl.trim() === '') {
        applyAppIconsAndManifest(null);
        if (isMounted) {
          setIcons(null);
          setIsProcessing(false);
        }
        return;
      }

      setIsProcessing(true);
      const generated = await generateAppIcons(logoUrl);

      if (isMounted) {
        setIcons(generated);
        setIsProcessing(false);
        applyAppIconsAndManifest(generated, logoUrl);
      }
    }

    syncIcons();

    return () => {
      isMounted = false;
    };
  }, [logoUrl]);

  return {
    icons,
    isProcessing,
  };
}
