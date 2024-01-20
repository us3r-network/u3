import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

function InstallPWAButton() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      console.log('we are being triggered :D');
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('transitionend', handler);
  }, []);

  const onClick = (evt) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };
  if (!supportsPWA) {
    return null;
  }
  return (
    <Button
      type="button"
      className="
        w-[140px]
        h-[48px]
        px-[24px]
        py-[12px]
        rounded-[12px]
        bg-[#FFF]
        text-[#14171A]
        text-[16px]
        font-medium
        leading-[24px]
        mx-[auto]
        hover:bg-[#FFF]
      "
      id="setup_button"
      aria-label="Install app"
      title="Install app"
      onClick={onClick}
    >
      Install
    </Button>
  );
}

export default InstallPWAButton;
