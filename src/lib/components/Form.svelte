<!-- src/lib/components/Form.svelte -->
<script lang="ts">
    import { setContext } from 'svelte';
    import { createFormStore } from '$lib/stores/form-store.js';
    import type { FormProps } from '$lib/types.js';
    import Toast from './Toast.svelte'; // We'll create this

    let {
        title,
        description,
        style = 'default',
        submit_label = 'Submit',
        error_message = 'Please complete all required fields correctly',
        on_submit,
        is_submitting = false,
        children
    } : FormProps = $props();

    const formStore = createFormStore();
    let showError = $state(false);
    let currentErrors = $state<Array<{ name: string; type: 'empty' | 'invalid' }>>([]);

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        const result = formStore.handleSubmit();
        
        if (result.isValid) {
            showError = false;
            currentErrors = [];
            on_submit(event);
        } else {
            showError = true;
            currentErrors = result.errors;
        }
    }

    setContext('formStore', formStore);

    const styles = {
        default: 'space-y-6',
        compact: 'space-y-4',
        bordered: 'space-y-6 p-6 border rounded-lg shadow-sm'
    };
</script>

<form 
    onsubmit={handleSubmit}
    class={styles[style]}
    novalidate
>
    {#if title || description}
        <div class="text-center space-y-2 mb-12">
            {#if title}
                <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    {title}
                </h1>
            {/if}
            {#if description}
                <p class="mt-4 text-lg text-gray-600">
                    {description}
                </p>
            {/if}
        </div>
    {/if}

    <div class="space-y-6">
        {@render children()}
    </div>

    <div class="flex justify-center mt-6">
        <button
            type="submit"
            disabled={is_submitting}
            class="inline-flex justify-center rounded-md bg-indigo-600 
                   px-12 py-3 text-base font-medium text-white hover:bg-indigo-700 
                   focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {submit_label}
        </button>
    </div>

    {#if showError}
        <div class="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
            <p class="text-red-700">{error_message}</p>
            <ul class="mt-2 list-disc list-inside text-sm text-red-600">
                {#each currentErrors as error}
                    <li>
                        {error.name}: {error.type === 'empty' ? 'Required field' : 'Invalid value'}
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</form>