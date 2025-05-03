use js_sys::Math;
use leptos::{html::Button, prelude::*};
use leptos_use::{use_element_size, UseElementSizeReturn};

#[component]
pub fn Egg() -> impl IntoView {
    let (count, set_count) = signal(0);

    let el = NodeRef::<Button>::new();
    let bref = document().query_selector("body").unwrap().unwrap();

    let UseElementSizeReturn {
        width: widthe,
        height: heighte,
    } = use_element_size(el);

    let UseElementSizeReturn {
        width: widthb,
        height: heightb,
    } = use_element_size(bref);

    let random_x = move || get_random(0, (widthb.get() - widthe.get()) as i32);
    let random_y = move || get_random(0, (heightb.get() - heighte.get()) as i32);

    let (left, set_left) = signal(random_x());
    let (top, set_top) = signal(random_y());

    view! {
        <button
            node_ref=el
            on:click=move |_| {
                *set_count.write() += 1;
                set_left.set(random_x());
                set_top.set(random_y());
            }
            class="egg"
            style:right=move || format!("{}px", left.get())
            style:bottom=move || format!("{}px", top.get())
        >
            {count}
        </button>
    }
}

fn get_random(l: i32, u: i32) -> i32 {
    (Math::random() * ((u - l) as f64)) as i32 + l
}
