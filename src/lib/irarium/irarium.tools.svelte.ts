import type { Thought, Irarium } from '$lib/shared/shared.type';

/**
 * Count total thoughts in an irarium
 * Recursively counts all thoughts including children and their descendants
 */
export function countThoughts(irarium: Irarium): number {
  if (!irarium || !irarium.children) return 0;

  let count = 0;

  // Count direct children and their descendants
  const countAllChildren = (thoughts: Thought[]) => {
    for (const thought of thoughts) {
      count++;
      if (thought.children && thought.children.length > 0) {
        countAllChildren(thought.children);
      }
    }
  };

  countAllChildren(irarium.children);
  return count;
}
