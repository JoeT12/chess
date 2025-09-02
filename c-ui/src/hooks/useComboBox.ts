import { useState } from "react";

export function useComboBox() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("easy");

  return {
    open,
    setOpen,
    value,
    setValue,
  };
}
