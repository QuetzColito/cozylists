<script lang="ts">
    // Imports
    import { Anime } from '$lib/Anime'
    import { genreColors, ratings } from '$lib/values'

    // Props
    export let anime: Anime;
    export let visual: boolean;
    export let active: boolean;
    export let id: number;
    export let anchor: number;
    export let end: number;
    export let insert: boolean;
    export let edit: number;

    // Reactives
    $: isEdit = edit === id;
    $: isSelected = ((id >= Math.min(anchor, end) && id <= Math.max(anchor, end) && visual)
                    || (!visual && id === anchor))  && active


    const initEdit = (el:any) => {
        setTimeout(el.focus(),0);
        if (insert) {
            el.selectionStart = 0
            el.selectionEnd = 0
        } else {
            el.selectionStart = el.value.length
            el.selectionEnd = el.value.length
        }
    }
</script>

<li
    class:isSelected={isSelected && !visual}
    class:visual={isSelected && visual}
    class:isEdit
    style = "color: var({genreColors[anime.genre]})"
>
    {#if anime.rating}
        <span>{ratings[anime.rating]}</span>
    {/if}
    {#if isEdit}
        <input
            bind:value={anime.name}
            type="text"
            use:initEdit
        />
    {:else}
        {anime.name}
    {/if}
    {#if anime.rating === ratings.length - 1}
        <span>{ratings[anime.rating]}</span>
    {/if}
</li>

<style lang="scss">
    .isSelected {
        background-color: var(--bg-select);
    }
    .visual {
        background-color: var(--bg-night);
    }

    .isEdit {
        background-color: var(--bg-night);
    }

    li {
        background: none;
        padding: .1rem;
        border-top: 1px solid #a9b1d650;
    }

    input {
        -webkit-appearance: none;
        appearance: none;
        outline: none;
        background: none;
        border: none;
        margin: none;
        padding: none;
        box-shadow: none;
    }

</style>
