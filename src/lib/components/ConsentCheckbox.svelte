<!-- src/lib/components/ConsentCheckbox.svelte -->
<script lang="ts">
    import { getContext } from 'svelte';
    import type { ConsentCheckProps, FormStore } from '$lib/types.js';

    let {
        name,
        required = false,
        text,
        checked = $bindable(false),
        tooltip
    } : ConsentCheckProps = $props();

    const formStore = getContext<FormStore>('formStore');
    formStore.registerField(name, required);

    const isError = formStore.isFieldInError(name);

    function validateInput() {
        formStore.validateField(name, checked);
    }

    function handleInput() {
        formStore.clearFieldError(name);
        validateInput();
    }

    $effect(() => {
        validateInput();
    });

    const inputClasses = $derived(
        $isError ? 'bg-red-300/50 border-red-500 ring-red-500 outline outline-2 outline-red-500' :
                   'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    );
</script>

<div class="form-field w-full mt-4">
    <label class="flex items-start cursor-pointer rounded-md p-2 {inputClasses}"
            title={tooltip ?? undefined}>
        <div class="flex-shrink-0">
            <input
                type="checkbox"
                {name}
                {required}
                bind:checked={checked}
                onclick={handleInput}
                class="rounded border-gray-300 text-indigo-600 mb-2 ml-1
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