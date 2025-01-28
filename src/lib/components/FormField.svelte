<script lang="ts">
    import type { FormFieldProps } from '$lib/types.js';

    let {
        name,
        label,
        required = false,
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
</div>