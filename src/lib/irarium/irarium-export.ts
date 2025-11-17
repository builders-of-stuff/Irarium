/**
 * Utility functions for exporting irariums
 */

/**
 * Downloads a JSON file to the user's browser
 */
export function downloadJsonFile(data: unknown, filename: string): void {
	const jsonString = JSON.stringify(data, null, 2);
	const blob = new Blob([jsonString], { type: 'application/json' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();

	// Clean up
	URL.revokeObjectURL(url);
}

/**
 * Sanitizes a string to be used as a filename
 */
export function sanitizeFilename(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 50);
}
