import { useCallback, useState } from "react";

interface IPopupState {
  id?: string;
  show: boolean;
}

/**
 * A hook that returns a state variable and two functions to control
 * popup content and visibility
 *
 * @returns An array containing:
 *   - A state variable that describes whether the popup is shown or not,
 *     and which id should be passed to the component.
 *   - A function that hides the popup.
 *   - A function that shows the popup with the given id.
 */
const usePopup = () => {
  const [show, setShow] = useState<IPopupState>({ show: false, id: "" });
  const hidePopup = useCallback(
    () => setShow((old) => ({ show: false, id: old.id })),
    [],
  );

  const showPopup = (id?: string) => setShow({ show: true, id });

  return [show, showPopup, hidePopup] as [
    IPopupState,
    (id?: string) => void,
    () => void,
  ];
};

export default usePopup;
