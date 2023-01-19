import { ReactElement } from "react";

interface ContainerProps {
  onExit: () => void;
  overlayClassName?: string;
  className?: string;
  children?: ReactElement | ReactElement[];
}

export const Overlay = (props: ContainerProps) => {
  return (
    <div
      className="flex fixed top-0 bottom-0 left-0 right-0 overflow-scroll bg-black bg-opacity-50 cursor-default pb-8"
      style={{zIndex: 9000}}
      onClick={props.onExit}
    >
      <div className={`${props.overlayClassName} m-auto`} onClick={(e) => e.stopPropagation()}>
        {props.children}
      </div>
    </div>)
}