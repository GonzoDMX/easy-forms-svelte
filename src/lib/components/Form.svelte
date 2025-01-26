<!-- src/lib/components/Form.svelte -->
<script lang="ts">
    import type { FormProps } from '$lib/types.js';

    let {
        title,
        description,
        style = 'default',
        submit_label = 'Submit',
        on_submit,
        is_submitting = false,
        children
    } : FormProps = $props();

    const styles = {
        default: 'space-y-6',
        compact: 'space-y-4',
        bordered: 'space-y-6 p-6 border rounded-lg shadow-sm'
    };

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        on_submit(event);
    }
</script>

<form 
    onsubmit={handleSubmit}
    class={styles[style]}
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

    <div class="flex justify-end mt-6">
        <button
            type="submit"
            disabled={is_submitting}
            class="inline-flex justify-center rounded-md bg-indigo-600 
                   px-6 py-2.5 text-white hover:bg-indigo-700 
                   focus:ring-2 focus:ring-indigo-500 
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {submit_label}
        </button>
    </div>
</form>
