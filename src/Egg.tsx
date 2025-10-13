import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import "./styles/style.scss";

const Egg: Component = () => {
  const [count, setCount] = createSignal(0);
  const [right, setRight] = createSignal(30);
  const [top, setTop] = createSignal(30);

  const handleClick = () => {
    setCount(count() + 1);
    setRight(
      Math.random() *
        (document.body.offsetWidth -
          (document.getElementById("egg")?.offsetWidth || 0)),
    );
    setTop(
      Math.random() *
        (document.body.offsetHeight -
          (document.getElementById("egg")?.offsetHeight || 0)),
    );
  };

  return (
    <button
      onClick={handleClick}
      class="egg"
      id="egg"
      style={{ right: `${right()}px`, top: `${top()}px` }}
    >
      {count()}
    </button>
  );
};

export default Egg;
