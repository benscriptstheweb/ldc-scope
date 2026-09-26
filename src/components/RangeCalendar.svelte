<script lang="ts">
	import { RangeCalendar } from 'bits-ui';
	import CaretLeft from '../icons/CaretLeft.svelte';
	import CaretRight from '../icons/CaretRight.svelte';

	let { value = $bindable() } = $props();
</script>

<RangeCalendar.Root
	class="rounded-15px border-dark-10 bg-background-alt shadow-card mt-6 border p-[22px]"
	weekdayFormat="short"
	fixedWeeks={true}
	bind:value
>
	{#snippet children({ months, weekdays })}
		<RangeCalendar.Header class="flex items-center justify-between">
			<RangeCalendar.PrevButton
				class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
			>
				<CaretLeft />
			</RangeCalendar.PrevButton>
			<RangeCalendar.Heading class="text-[15px] font-medium" />
			<RangeCalendar.NextButton
				class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
			>
				<CaretRight />
			</RangeCalendar.NextButton>
		</RangeCalendar.Header>
		<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
			{#each months as month (month.value.month)}
				<RangeCalendar.Grid class="w-full border-collapse select-none space-y-1">
					<RangeCalendar.GridHead>
						<RangeCalendar.GridRow class="mb-1 flex w-full justify-between">
							{#each weekdays as day (day)}
								<RangeCalendar.HeadCell
									class="text-muted-foreground font-normal! w-10 rounded-md text-xs"
								>
									<div>{day.slice(0, 2)}</div>
								</RangeCalendar.HeadCell>
							{/each}
						</RangeCalendar.GridRow>
					</RangeCalendar.GridHead>
					<RangeCalendar.GridBody>
						{#each month.weeks as weekDates, i (i)}
							<RangeCalendar.GridRow class="flex w-full">
								{#each weekDates as date, d (d)}
									<RangeCalendar.Cell
										{date}
										month={month.value}
										class="p-0! relative m-0 size-10 text-center text-sm focus-within:z-20"
									>
										<RangeCalendar.Day
											class="rounded-btn text-base-content hover:bg-base-200
         data-selected:bg-primary data-selected:text-primary-content
         data-highlighted:bg-base-200
         data-disabled:text-base-content/30 data-disabled:pointer-events-none
         data-unavailable:line-through
         relative inline-flex size-10 items-center justify-center text-sm"
										>
											<div
												class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full"
											></div>
											{date.day}
										</RangeCalendar.Day>
									</RangeCalendar.Cell>
								{/each}
							</RangeCalendar.GridRow>
						{/each}
					</RangeCalendar.GridBody>
				</RangeCalendar.Grid>
			{/each}
		</div>
	{/snippet}
</RangeCalendar.Root>
