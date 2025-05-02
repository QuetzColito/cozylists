use js_sys::Math;
use leptos::{html::Div, prelude::*};
use leptos_use::{use_element_size, UseElementSizeReturn};

#[component]
fn App() -> impl IntoView {
    let (count, set_count) = signal(0);
    let el = NodeRef::<Div>::new();
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
        <div
            node_ref=el
            on:click=move |_| {
                *set_count.write() += 1;
                set_left.set(random_x());
                set_top.set(random_y());
            }
            style="position: absolute"
            style=("background-image", "url(egg.svg)")
            style=("text-align", "center")
            style=("color", "#101018")
            style=("padding", ".5em 0")
            style:height="1em"
            style:width="2em"
            style:left=move || format!("{}px", left.get())
            style:top=move || format!("{}px", top.get())
        >
            {count}
        </div>
    }
}

fn get_random(l: i32, u: i32) -> i32 {
    (Math::random() * ((u - l) as f64)) as i32 + l
}

fn main() {
    console_error_panic_hook::set_once();
    leptos::mount::mount_to_body(App);
}
