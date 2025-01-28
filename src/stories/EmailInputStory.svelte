<!-- src/stories/EmailInputStory.svelte -->
<script lang="ts">
    import Form from '$lib/components/Form.svelte';
    import EmailInput from '$lib/components/EmailInput.svelte';

    export let name = 'email';
    export let label = 'Email Address';
    export let required = false;
    export let placeholder = '';
    export let error_msg = 'This field is required';
    export let invalid_msg = 'Invalid input';
    export let showFullForm = false;

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        console.log('Form submitted');
    }
</script>

{#if showFullForm}
    <Form
        title="Contact Form"
        description="Please provide your contact information"
        style="bordered"
        submit_label="Send Message"
        on_submit={handleSubmit}
    >
        <EmailInput
            {name}
            {label}
            {required}
            {placeholder}
            {error_msg}
            {invalid_msg}
        />
    </Form>
{:else}
    <Form on_submit={handleSubmit}>
        <EmailInput
            {name}
            {label}
            {required}
            {placeholder}
            {error_msg}
            {invalid_msg}
        />
    </Form>
{/if}