use egg::Egg;
use leptos::prelude::*;

mod egg;

#[component]
fn App() -> impl IntoView {
    view! {
        <div />
        <Egg />
    }
}

fn main() {
    console_error_panic_hook::set_once();
    leptos::mount::mount_to_body(App);
}
