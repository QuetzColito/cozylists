<script lang="ts">
    import CozyList from './AnimeList.svelte';
    import type {Anime} from '$lib/Anime';
    import {data} from '$lib/testData';
    import { states } from '$lib/values';
    let selected = 0;
    let clipboard: Anime[] = [];
    let edits: number[] = Array.from(states, () => -1);
    function handleKeydown(event: KeyboardEvent) {
        if (edits.filter( (i) => i !== -1).length > 0) return;
        handleKey(event.key);
    }

    const bound = (xs: any[], i: number) => Math.max(0, Math.min(xs.length-1, i));

    function handleKey(key: string) {
        switch (key) {
            case 'K':
                selected = bound(states, selected - 1)
                break;
            case 'h': case 'H':
                selected = bound(states, selected - 2)
                break;
            case 'J':
                selected = bound(states, selected + 1)
                break;
            case 'l': case 'L':
                selected = bound(states, selected + 2)
                break;
        }
    }
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class = "grid">
    {#each states as _, state}
        <CozyList
            bind:clipboard
            bind:selected
            {state}
            bind:edit={edits[state]}
            items={data.filter((anime) => anime.state === state )}
        />
    {/each}
</div>

<style lang="scss">
    :global(body) {
        font-family: "Iosevka";
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background-color: #1a1b26;
    }

    :global(*) {
        box-sizing: border-box;
        color: var(--text-main)
    }

    :global(:root) {
        --bg-night: #1a1b26;
        --fg-light: #CBCCD1;
        --bg-storm: #24283b;
        --bg-select: #2f3549;
        --text-main: #787C99;
        --term-black: #414868;
        --term-red: #f7768e;
        --term-orange: #ff9e64;
        --term-yellow: #E0AF68;
        --term-green: #9ece6a;
        --term-cyan: #7dcfff;
        --term-blue: #7aa2f7;
        --term-purple: #bb9af7;
    }

    .grid{
        display: flex;

    }
</style>
