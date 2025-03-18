import type { Idea, Irarium } from '$lib/shared/shared.type';

/**
 * Count total ideas in an irarium
 * Recursively counts all ideas including children and their descendants
 */
export function countIdeas(irarium: Irarium): number {
  if (!irarium || !irarium.children) return 0;

  let count = 0;

  // Count direct children and their descendants
  const countAllChildren = (ideas: Idea[]) => {
    for (const idea of ideas) {
      count++;
      if (idea.children && idea.children.length > 0) {
        countAllChildren(idea.children);
      }
    }
  };

  countAllChildren(irarium.children);
  return count;
}
