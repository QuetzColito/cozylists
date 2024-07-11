<script lang="ts">
    // Imports
    import {genres, genreColors} from '$lib/values';

    // Props
    export let name: string;
    export let id: number;
    export let selected: number | undefined;

    $: color = genres.includes(name) ? genreColors[id] : "";

</script>

<li
    class:isSelected={id === selected}
    style = "color: var({color})"
>
    {name}
</li>

<style lang="scss">
    li {
        background: none;
        padding: .1rem;
        border-top: 1px solid #a9b1d650;
    }

    .isSelected {
        background-color: var(--bg-select);
    }
</style>
