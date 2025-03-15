import type { Irarium } from '$lib/shared/shared.type';

export const mapIrariumToCreate = (irarium: Irarium) => {
  return {
    userId: irarium.userId,
    title: irarium.title,
    description: irarium.description,
    tags: irarium.tags,
    content: irarium.content,
    children: irarium.children
  };
};
