import { useContext } from "react";
import { StateContext } from "../context/features/states";

interface propsIFace {
  text: string;
  textBold: string;
}

const DeleteModal: React.FC<propsIFace> = ({ text, textBold }) => {
  const { showDeleteModalHandler } = useContext(StateContext);

  return (
    <div
      className="del-warning-bg"
      onClick={() => showDeleteModalHandler(false)}
    >
      <div
        className="del-warning-container"
        onClick={(e) => e.stopPropagation()}
      >
        <p id="warn-text">
          {text} <b>{textBold}</b>
        </p>
        <div className="btns">
          <button id="yes">Yes</button>
          <button id="no" onClick={() => showDeleteModalHandler(false)}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
