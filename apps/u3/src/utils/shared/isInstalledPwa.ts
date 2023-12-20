export default function isInstalledPwa() {
  const mqStandAlone = '(display-mode: standalone)';
  return (
    (navigator as any).standalone || window.matchMedia(mqStandAlone).matches
  );
}
