<!-- src/lib/components/Toast.svelte -->
<script lang="ts">
    export let message: string;
    export let type: 'error' | 'success' | 'warning' = 'error';
</script>

<div class="flex justify-center mt-6">
    <div class="bg-white rounded-lg shadow-lg p-4 border-l-4 
                {type === 'error' ? 'border-red-500 border-l-4' : 
                 type === 'warning' ? 'border-amber-500' : 
                 'border-green-500'}">
        <p class="text-sm text-gray-700">{message}</p>
    </div>
</div>