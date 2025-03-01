<script lang="ts">
  let {
    content,
    timestamp = new Date(),
    onDelete
  } = $props<{
    content: string;
    timestamp?: Date;
    onDelete?: () => void;
  }>();
</script>

<div class="tweet-item mb-3 rounded-lg border p-4">
  <div class="prose prose-sm max-w-none">
    {@html content}
  </div>
  <div class="mt-2 flex items-center justify-between text-sm text-gray-500">
    <span>
      {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
    <button
      class="text-red-500 hover:text-red-700"
      onclick={() => onDelete && onDelete()}
    >
      Delete
    </button>
  </div>
</div>
