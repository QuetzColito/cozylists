<script lang="ts">
    // Imports
    import PickerItem from './PickerItem.svelte'

    // Props
    export let options: string[];
    export let title: string;
    export let selected: number | undefined;

</script>

<h1>
    {title}
</h1>

<ul>
    {#each options as name, id}
        <PickerItem {name} {id} bind:selected/>
    {/each}
</ul>



<style lang="scss">
    h1 {
        text-align: center;
    }

    ul {
        list-style-type: none;
        padding: 0rem 1.5rem;
    }

</style>
