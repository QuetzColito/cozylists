import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import "./styles/style.scss";

const Egg: Component = () => {
  const [count, setCount] = createSignal(0);
  const [x, set_x] = createSignal(30);
  const [y, set_y] = createSignal(30);

  const handleClick = () => {
    setCount(count() + 1);
    set_x(
      Math.random() *
        (document.body.offsetWidth -
          (document.getElementById("egg")?.offsetWidth || 0)),
    );
    set_y(
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
      style={{ right: `${x()}px`, bottom: `${y()}px` }}
    >
      {count()}
    </button>
  );
};

export default Egg;
