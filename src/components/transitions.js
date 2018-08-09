import './transitions.css';

export const growHeight = {
  classNames: "transition-grow-height",
  timeout   : 150,
  onEnter   : el => el.style.height = "0",
  onEntering: el => el.style.height = el.scrollHeight + "px",
  onEntered : el => el.style.height = null,
  onExit    : el => el.style.height = el.scrollHeight + "px",
  onExiting : el => el.style.height = "0",
  onExited  : el => el.style.height = null
};

export const scale = {
  classNames: "transition-scale",
  timeout   : 150
};