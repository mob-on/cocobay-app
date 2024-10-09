import { Combo } from "@shared/src/interfaces/Combo.interface";
import { Popup, ProgressBar } from "antd-mobile";
import React from "react";

import Button from "../shared/Button";

interface ComboPopupProps {
  visible: boolean;
  onClose: () => void;
  combo: Combo;
  actionName?: string;
}

export const ComboPopup: React.FC<ComboPopupProps> = ({
  visible,
  onClose,
  combo,
}) => {
  const progress = (combo.current / combo.objective) * 100;

  return (
    <Popup
      visible={visible}
      onClose={onClose}
      closeOnMaskClick={true}
      bodyClassName="h-1/2 flex flex-col justify-center items-center text-white h-full p-inner"
    >
      <div className="text-center flex flex-col h-full w-full">
        <h1 className="text-5xl mb-half-inner font-bold mt-auto">
          Combo x{combo.current}!
        </h1>
        <h2 className="text-3xl mb-inner">{combo.message}</h2>
        <img
          src={combo.pictureSrc}
          alt={combo.message}
          className="w-32 self-center mt-auto"
        />
        <div className="mb-half-inner w-full mt-auto self-center">
          <ProgressBar
            percent={progress}
            text={`${combo.current}/${combo.objective}`}
          />
        </div>

        <Button
          color="gradient"
          fill="solid"
          onClick={onClose}
          className="text-xl self-end"
        >
          Okay!
        </Button>
      </div>
    </Popup>
  );
};
