import { nanoid } from 'nanoid';

import type { Idea } from '$lib/shared/shared.type';

import { appState } from './app.state.svelte';

// For current active irarium
export class IrariumState {
  id = $state('');
  userId = $derived(appState.userId);
  created = $state('');
  updated = $state('');

  title = $state('');
  description = $state('');
  tags = $state('');
  content = $state('');
  hasContent = $derived(this.content.length > 0);
  children = $state<Idea[]>([]);

  inputContent = $state('');
  activeParentIdeaId = $state('');
  activeParentIdea = $derived(
    this.activeParentIdeaId ? this.findIdeaById(this.activeParentIdeaId) : undefined
  );

  optionsParentIdeaIds = $derived(this.buildOptionsParentIdeaIds());

  constructor() {}

  setContent(content: string) {
    this.content = content;
  }

  addToIrarium(content: string, parentIdea?: Idea) {
    const idea = this.mapContentToIdea(content, parentIdea?.depth);

    if (!parentIdea?.id) {
      // If no parent, add directly to root level
      this.children = [...this.children, idea];
    } else {
      // If there's a parent, find and update that parent in the tree
      const parentId = parentIdea.id;
      const parent = this.findIdeaById(parentId);

      if (parent) {
        // Create updated parent with new child added
        const updatedParent = {
          ...parent,
          children: [...parent.children, idea]
        };

        // Update the entire tree with this modified parent
        this.children = this.updateIdeaById(parentId, updatedParent);
      }
    }

    this.activeParentIdeaId = idea.id;

    return idea;
  }

  findIdeaById(id: string, ideas: Idea[] = this.children): Idea | undefined {
    // First check if the idea exists at the current level
    const directMatch = ideas.find((idea) => idea.id === id);

    if (directMatch) return directMatch;

    // If not found at current level, search through all children recursively
    return ideas.flatMap((idea) => idea.children).length > 0
      ? this.findIdeaById(
          id,
          ideas.flatMap((idea) => idea.children)
        )
      : undefined;
  }

  updateIdeaById(id: string, updatedIdea: Idea, ideas: Idea[] = this.children): Idea[] {
    // Map through the current level of ideas
    return ideas.map((idea) => {
      // If this is the idea we're looking for, replace it with the updated idea
      if (idea.id === id) {
        return updatedIdea;
      }

      // If this idea has children, recursively search and update them
      if (idea.children.length > 0) {
        return {
          ...idea,
          children: this.updateIdeaById(id, updatedIdea, idea.children)
        };
      }

      // Otherwise return the idea unchanged
      return idea;
    });
  }

  private mapContentToIdea(content: string, parentDepth?: number) {
    const now = new Date().toISOString();
    const id = nanoid(5);
    const depth = parentDepth ? parentDepth + 1 : 1;

    return {
      id,
      content,
      children: [],
      depth,
      created: now,
      updated: now
    };
  }

  private buildOptionsParentIdeaIds() {
    // Helper function to recursively collect all ideas
    const collectAllIdeas = (ideas: Idea[]): { label: string; value: string }[] => {
      return ideas.flatMap((idea) => [
        { label: this.truncateContent(idea.content, 30), value: idea.id },
        ...collectAllIdeas(idea.children)
      ]);
    };

    return [{ label: 'Root', value: '' }, ...collectAllIdeas(this.children)];
  }

  private truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
}
