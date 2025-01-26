<!-- src/lib/components/FormRow.svelte -->
<script lang="ts">
    let { gap = 4, children } = $props<{
        gap?: number;
        children: () => any;
    }>();
</script>

<div class="grid grid-cols-2 gap-{gap}">
    {@render children()}
</div>