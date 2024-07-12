<script lang="ts">
    // Imports
    import CozyItem from './Anime.svelte'
    import Picker from './Picker.svelte';
    import { Anime } from '$lib/Anime'
    import {states, genres, ratings, ratingDescriptions, commands} from '$lib/values'

    // Props
    export let items: Anime[];
    export let state: number;
    export let selected: number;
    export let clipboard: Anime[];
    export let edit: number;

    // Variables
    let history:Anime[][] = [];
    let anchor = 0;
    let end = 0;
    let visual = false;
    let insert = true;
    let pickerSelection: undefined | number = undefined;
    let pickRating = false;
    let pickGenre = false;
    let showHelp = false;

    // Reactives
    $: active = selected===state;
    $: lower = Math.min(anchor, end);
    $: upper = Math.max(anchor, end);
    $: range = Math.abs(anchor - end) + 1;

    function handleKeydown(event: KeyboardEvent) {
        if (!active) return;
        if (edit !== -1 ) {
            handleKeyEdit(event);
        } else if (pickRating || pickGenre) {
            handleKeyPicker(event);
        } else if (showHelp) {
            handleKeyHelp(event);
        } else if (visual) {
            handleKeyVisual(event);
        } else {
            handleKeyNormal(event);
        }
    }

    const bound = (list: any[], i: number) => Math.max(0, Math.min(list.length-1, i));

    const singleSelect = (i: number) => {
        visual = false;
        end = anchor = i;
    }

    function handleKeyHelp(event: KeyboardEvent) {
        switch (event.key) {
            case 'Enter': case 'Escape': case 'q': case '?':
                showHelp = pickGenre = pickRating = false;
        }
    }

    function handleKeyPicker(event: KeyboardEvent) {
        let pickList = pickRating ? ratings : genres;
        switch (event.key) {
            case 'k':
                pickerSelection = bound(pickList, (pickerSelection ?? 0) - 1);
                break;
            case 'j':
                pickerSelection = bound(pickList, (pickerSelection ?? 0) + 1);
                break;
            case 'Enter': case 'Escape': case 'q':
                if (pickRating) {
                    items[anchor].rating = pickerSelection ?? 0;
                } else {
                    items[anchor].genre = pickerSelection ?? 0;
                }
                pickGenre = pickRating = false;
        }
    }

    function handleKeyEdit(event: KeyboardEvent) {
        switch (event.key) {
            case 'Enter': case 'Escape':
                if (!items[edit].name) handleKeyNormal(new KeyboardEvent('keypress', {key: 'd'}))
                edit = -1;
        }
    }

    function handleKeyVisual(event: KeyboardEvent) {
        switch (event.key) {
            case 'k':
                end = bound(items, end - 1);
                break;
            case 'j':
                end = bound(items, end + 1);
                break;
            case 'v': case 'V':
                visual = false;
                break;
            case 'p':
                history.push(structuredClone(items));
                items.splice(upper + 1, 0, ...clipboard);
                singleSelect(upper);
                items = items;
                break;
            case 'd':
                history.push(structuredClone(items));
                clipboard = items.splice(lower, range)
                items = items;
                end = bound(items, end);
                anchor = bound(items, anchor);
                singleSelect(Math.min(anchor, end));
                break;
            case 'y':
                clipboard = items.slice(lower, upper+1)
                singleSelect(lower);
                break;
            case 'u':
                items = history.pop() ?? items;
                break;
            case 'o':
                event.preventDefault();
                visual = false;
                history.push(structuredClone(items));
                if (items.length === 0) upper = -1;
                items.splice(upper+1, 0, new Anime(state))
                singleSelect(upper+1);
                edit = upper+1;
                items = items;
                break;
            case 'O':
                event.preventDefault();
                history.push(structuredClone(items));
                items.splice(lower, 0, new Anime(state))
                items = items;
                singleSelect(lower);
                edit = lower;
                break;
            case 'Escape':
                visual = false;
                singleSelect(end);
                break;
        }

    }

    // The Handler
    function handleKeyNormal(event: KeyboardEvent) {
        switch (event.key) {
            case 'k':
                anchor = bound(items, anchor - 1);
                break;
            case 'j':
                anchor = bound(items, anchor + 1);
                break;
            case 'v': case 'V':
                end = anchor;
                visual = true;
                break;
            case 'p':
                history.push(structuredClone(items));
                items.splice(anchor + 1, 0, ...clipboard);
                items = items;
                break;
            case 'd':
                history.push(structuredClone(items));
                clipboard = items.splice(anchor, 1)
                items = items;
                anchor = bound(items, anchor);
                break;
            case 'y':
                clipboard = [items[anchor]]
                break;
            case 'u':
                items = history.pop() ?? items;
                break;
            case 'c':
                event.preventDefault();
                items[anchor].name = "";
                edit = anchor;
                break;
            case 'i':
                insert = true;
                event.preventDefault();
                edit = anchor;
                break;
            case 'a':
                insert = false;
                event.preventDefault();
                edit = anchor;
                break;
            case 'o':
                event.preventDefault();
                history.push(structuredClone(items));
                if (items.length === 0) anchor = -1;
                items.splice(anchor+1, 0, new Anime(state));
                anchor = anchor + 1;
                edit = anchor;
                items = items;
                break;
            case 't':
                history.push(structuredClone(items));
                if (items.length === 0) anchor = -1;
                items.splice(anchor+1, 0, new Anime(state, 0, "test", 0));
                anchor = anchor + 1;
                items = items;
                break;
            case 'O':
                event.preventDefault();
                history.push(structuredClone(items));
                items.splice(anchor, 0, new Anime(state))
                items = items;
                edit = anchor;
                break;
            case 'r':
                pickerSelection = items[anchor].rating;
                pickRating = true;
                break;
            case 'b':
                pickerSelection = items[anchor].genre;
                pickGenre = true;
                break;
            case '?':
                pickerSelection = undefined;
                showHelp = true;
        }

    }

</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="list" class:active class:last={state === states.length-1}>
    {#if pickGenre}
        <Picker options={genres}
            bind:selected={pickerSelection}
                title={items[anchor].name}
        />
    {:else if pickRating}
        <Picker options={ratingDescriptions}
            bind:selected={pickerSelection}
                title={items[anchor].name}
        />
    {:else if showHelp}
        <Picker options={commands}
                selected={undefined}
                title={"Commands"}
        />
    {:else}
        <h1>
            {states[state]}
        </h1>

        <ul>
            {#each items as anime, id (id)}
                <CozyItem
                    bind:visual
                    bind:active
                    bind:edit
                    bind:anchor
                    bind:end
                    bind:insert
                    {id}
                    {anime}
                />
            {/each}
        </ul>
    {/if}
</div>

<style lang="scss">
    h1 {
        text-align: center;
    }

    .list {
        background-color: var(--bg-storm);
        border-radius: 7px;
        border: solid var(--bg-storm);

        height: 40vh;
        width: 30vw;

        margin: 1.5vh;
        overflow: scroll;
    }

    .last {
        grid-row: span 2;
        height: 83vh;
    }

    ul {
        list-style-type: none;
        padding: 0rem 1.5rem;
    }

    .active {
        border: solid var(--term-cyan);
    }
</style>
