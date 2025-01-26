<!-- src/lib/components/ConsentCheckbox.svelte -->
<script lang="ts">
    import type { ConsentCheckProps } from '$lib/types.js';

    let {
        name,
        label,
        required = false,
        error_msg = 'This field is required',
        invalid_msg = 'Invalid input',
        text,
        checked = $bindable(false),
    } : ConsentCheckProps = $props();
</script>

<div class="form-field w-full mt-4">
    <label class="flex items-start cursor-pointer">
        <div class="flex-shrink-0">
            <input
                type="checkbox"
                {name}
                {required}
                bind:checked={checked}
                class="rounded border-gray-300 text-indigo-600 
                       focus:ring-indigo-500 cursor-pointer"
            />
        </div>
        <span class="ml-3 text-sm text-gray-600 select-none">
            {#if required}
                <span class="text-red-500">*</span>
            {/if}
            {text}
        </span>
    </label>
</div>