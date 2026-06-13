import { useCallback, useState } from "react";

type UseModalReturn = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setIsOpen: (v: boolean) => void;
};

export function useModal(initial = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState<boolean>(initial);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle, setIsOpen };
}

export default useModal;
