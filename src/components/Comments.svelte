<script lang="ts">
	import Comment from '../icons/Comment.svelte';
	import Trash from '../icons/Trash.svelte';
	import Dots from '../icons/Dots.svelte';

	let isCommenting = $state(false);
	let commentText = $state('');

	let { postCommentCallback, deleteCommentCallback, commentsData, currentUser } = $props();
</script>

<div class="items-center flex flex-col mt-10">
	<div class="w-80 comment-container">
		<div class="flex flex-row mb-3 justify-between items-center">
			<strong class="ml-1">Comments</strong>

			{#if !isCommenting}
				<button class="btn btn-soft" onclick={() => (isCommenting = !isCommenting)}
					><Comment /> New comment</button
				>
			{:else}
				<div>
					<button class="btn btn-ghost" onclick={() => (isCommenting = !isCommenting)}
						>Cancel</button
					>
					<button
						class="ml-3 btn btn-success btn-soft"
						onclick={() => postCommentCallback(commentText)}>Post</button
					>
				</div>
			{/if}
		</div>

		{#if isCommenting}
			<textarea maxlength="300" class="w-80 mb-5 textarea" bind:value={commentText}></textarea>
		{/if}

		{#each commentsData as comment}
			<div class="chat {currentUser === comment.user ? 'chat-end' : 'chat-start'}">
				<div class="chat-bubble flex flex-col">
					<div class="flex items-center">
						<p class="comment-origin">{comment.user}</p>
						{#if currentUser === comment.user}
							<details class="dropdown dropdown-end">
								<summary class="btn btn-ghost btn-xs btn-circle"><Dots /></summary>
								<ul class="menu dropdown-content bg-base-300 rounded-box z-1 w-50 shadow-sm">
									<li>
										<button class="btn btn-error" onclick={() => deleteCommentCallback(comment.id)}
											><Trash />Delete</button
										>
									</li>
								</ul>
							</details>
						{/if}
					</div>
					<p class="mr-4">{comment.comment}</p>
					<p class="comment-origin mt-2">
						{new Date(comment.created_at).toLocaleDateString('en-US')}
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.comment-origin {
		font-size: 0.7em;
		color: gray;
	}
</style>
