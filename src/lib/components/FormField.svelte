<!-- src/lib/components/FormField.svelte -->
<script lang="ts">
    import type { FormFieldProps } from '$lib/types.js';

    let {
        name,
        label,
        required = false,
        error = '',
        children
    } : FormFieldProps = $props();
</script>

<div class="form-field w-full">
    <label for={name} class="block text-sm font-medium text-gray-700">
        {label}
        {#if required}
            <span class="text-red-500">*</span>
        {/if}
    </label>
    <div class="mt-1">
        {@render children()}
    </div>
    {#if error}
        <p class="mt-1 text-sm text-red-600">{error}</p>
    {/if}
</div>