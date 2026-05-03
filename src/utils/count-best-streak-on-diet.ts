export function countBestStreakOnDiet(
	OnDiet: {
		is_on_diet: boolean | number;
	}[],
) {
	let count = 0;
	let bestStreak = 0;

	for (const meal of OnDiet) {
		if (meal.is_on_diet === 1) {
			count += 1;
		} else {
			bestStreak = count > bestStreak ? count : bestStreak;
			count = 0;
		}
	}

	if (count > bestStreak) {
		bestStreak = count;
	}

	return bestStreak;
}
