/**
 * Utility functions for exporting irariums
 */

import type { Irarium, Thought } from '$lib/shared/shared.type';

/**
 * Downloads a file to the user's browser
 */
export function downloadFile(data: string, filename: string, type: string = 'text/plain'): void {
	const blob = new Blob([data], { type });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();

	// Clean up
	URL.revokeObjectURL(url);
}

/**
 * Downloads a JSON file to the user's browser
 */
export function downloadJsonFile(data: unknown, filename: string): void {
	const jsonString = JSON.stringify(data, null, 2);
	downloadFile(jsonString, filename, 'application/json');
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

/**
 * Strips HTML tags from a string and decodes entities
 */
function stripHtml(html: string): string {
	if (!html) return '';
	
	// Create a temporary element to use browser's parsing
	const temp = document.createElement('div');
	temp.innerHTML = html;
	
	// Get text content (strips tags)
	let text = temp.textContent || temp.innerText || '';
	
	// Collapse multiple spaces/newlines into single spaces if needed, 
	// but we want to preserve newlines for the "line breaks within nodes" requirement.
	// However, TipTap might give us <p>Line 1</p><p>Line 2</p> which textContent turns into "Line 1Line 2" or "Line 1\nLine 2" depending on browser.
	// A better approach for preserving structure might be replacing <p> and <br> with newlines first.
	
	// Simple regex approach for common block elements to preserve some structure before stripping
	let processed = html
		.replace(/<\/p>/g, '\n')
		.replace(/<br\s*\/?>/g, '\n')
		.replace(/<\/div>/g, '\n');
		
	temp.innerHTML = processed;
	text = temp.textContent || temp.innerText || '';
	
	return text.trim();
}

/**
 * Converts an Irarium object to a Markdown string
 */
export function convertToMarkdown(irarium: Irarium): string {
	const title = stripHtml(irarium.title || 'Untitled');
	let md = `# ${title}\n\n`;
	
	if (irarium.description) {
		md += `> ${stripHtml(irarium.description)}\n\n`;
	}

	if (irarium.content) {
		md += `${stripHtml(irarium.content)}\n\n`;
	}

	const processThoughts = (thoughts: Thought[], depth: number): string => {
		let result = '';
		for (const thought of thoughts) {
			const indent = '  '.repeat(depth);
			const content = stripHtml(thought.content);
			
			// Handle multi-line content by indenting subsequent lines
			const lines = content.split('\n').filter(line => line.trim().length > 0);
			
			if (lines.length > 0) {
				// First line gets the bullet point
				result += `${indent}- ${lines[0]}\n`;
				
				// Subsequent lines get extra indentation to align with the text of the bullet point
				// Standard markdown list indentation is 2 spaces for the bullet + space
				for (let i = 1; i < lines.length; i++) {
					result += `${indent}  ${lines[i]}\n`;
				}
			} else {
				// Empty thought
				result += `${indent}-\n`;
			}
			
			if (thought.children && thought.children.length > 0) {
				result += processThoughts(thought.children, depth + 1);
			}
		}
		return result;
	};

	if (irarium.children && irarium.children.length > 0) {
		md += processThoughts(irarium.children, 0);
	}

	return md;
}
