import { nanoid } from 'nanoid';

import type { Idea } from '$lib/shared/shared.type';

import { authStore } from '../auth/auth.store.svelte';

// For current active irarium
export class IrariumStore {
  id = $state('');
  userId = $derived(authStore.userId);
  created = $state('');
  updated = $state('');

  title = $state('');
  description = $state('');
  tags = $state('');
  content = $state('');
  hasContent = $derived(this.content.length > 0);
  children = $state<Idea[]>([]);

  inputContent = $state('');
  // idea to push new idea to
  lastIdeaId = $state('');
  lastIdea = $derived(this.lastIdeaId ? this.findIdeaById(this.lastIdeaId) : undefined);

  allIdeasAsOptions = $derived(this.allIdeasToOptions());

  constructor() {}

  setContent(content: string) {
    this.content = content;
  }

  addToIrarium(content: string, parentIdea?: Idea) {
    const idea = this.buildIdea(content, parentIdea);

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

    this.lastIdeaId = idea.id;

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

  // Get all ideas (flat array)
  getAllIdeas() {
    let allIdeas = [] as any[];

    // Helper function to recursively collect ideas
    const collectIdeas = (ideas) => {
      for (const idea of ideas) {
        allIdeas = [...allIdeas, idea];
        if (idea.children && idea.children.length > 0) {
          collectIdeas(idea.children);
        }
      }
    };

    // Add root content, if exists
    if (this.hasContent) {
      allIdeas = [
        ...allIdeas,
        {
          id: this.id,
          content: this.content,
          children: this.children
        } as Idea
      ];
    }

    // Add child ideas
    collectIdeas(this.children);

    return allIdeas;
  }

  getSiblingIdeas(parentId) {
    const allIdeas = this.getAllIdeas();
    const parentIdea = allIdeas.find((idea) => idea.id === parentId);

    if (!parentIdea || !parentIdea?.children) {
      return [];
    }

    return parentIdea.children;
  }

  // Get chain of parent ideas (excludes last idea & root)
  getParentChain(ideaId = this.lastIdeaId) {
    if (!ideaId) {
      return [];
    }

    const buildParentChain = (
      ideas: Idea[],
      targetId: string,
      currentPath: Idea[] = []
    ) => {
      for (const idea of ideas) {
        if (idea.id === targetId) {
          return [...currentPath, idea];
        }

        if (idea.children && idea.children.length > 0) {
          const parentChain = buildParentChain(idea.children, targetId, [
            ...currentPath,
            idea
          ]);

          if (parentChain) return parentChain;
        }
      }

      return null;
    };

    let startingIdeas = this.children;
    let startingPath = [];

    const parentChain = buildParentChain(startingIdeas, ideaId, startingPath);

    if (!parentChain || parentChain?.length === 0) return [];

    // Exclude last idea because it's not a "parent"
    const uniqueChain = parentChain.slice(0, -1);

    return uniqueChain;
  }

  getChildChain(ideaId = this.lastIdeaId, index = 0) {
    let id = ideaId;
    let chain = [] as Idea[];
    let preferredIndex = index;

    const buildChildChain = (
      idea?: Idea,
      chain: Idea[] = [],
      isFirstIteration = false
    ): Idea[] => {
      // Use preferredIndex only for the first iteration, then default to 0
      const childIndex = isFirstIteration ? preferredIndex : 0;

      const children = idea ? idea.children : this.children;
      const targetChild = children[childIndex] || children[0];

      if (!targetChild) return chain;

      const updatedChain = [...chain, targetChild];

      return buildChildChain(targetChild, updatedChain);
    };

    let lastIdea = this.findIdeaById(id);
    const childChain = buildChildChain(lastIdea, chain, true);

    return childChain;
  }

  hasSiblingLeft(ideaId = this.lastIdeaId) {
    if (!ideaId) return false;

    const siblings = this.getSiblings(ideaId);
    if (siblings.length <= 1) return false;

    const currentIndex = siblings.findIndex((idea) => idea.id === ideaId);
    return currentIndex > 0;
  }

  hasSiblingRight(ideaId = this.lastIdeaId) {
    if (!ideaId) return false;

    const siblings = this.getSiblings(ideaId);
    if (siblings.length <= 1) return false;

    const currentIndex = siblings.findIndex((idea) => idea.id === ideaId);
    return currentIndex < siblings.length - 1;
  }

  getSiblings(ideaId = this.lastIdeaId) {
    if (!ideaId) return [];

    const findParent = (ideas, targetId, parent = null) => {
      for (const idea of ideas) {
        if (idea.id === targetId) {
          return parent;
        }

        if (idea.children && idea.children.length > 0) {
          const parent = findParent(idea.children, targetId, idea);
          if (parent) return parent;
        }
      }

      return null;
    };

    let startingIdeas = this.children;

    const parent = findParent(startingIdeas, ideaId);

    if (!parent) {
      return startingIdeas;
    }

    return parent.children || [];
  }

  private buildIdea(content: string, parent?: Idea) {
    const now = new Date().toISOString();
    const id = nanoid(5);
    const parentId = parent?.id;
    const depth = parent?.id ? parent.depth + 1 : 1;

    return {
      id,
      parentId: parentId || this.id,
      content,
      children: [],
      depth,
      created: now,
      updated: now
    };
  }

  private allIdeasToOptions() {
    const collectAllIdeas = (ideas: Idea[]): { label: string; value: string }[] => {
      return ideas.flatMap((idea) => {
        const position = this.findIdeaPosition(idea);

        const label = `${position} ${this.truncateContent(idea?.content, 8)}`;

        return [{ label, value: idea.id }, ...collectAllIdeas(idea.children)];
      });
    };

    return [{ label: 'Root', value: '' }, ...collectAllIdeas(this.children)];
  }

  // e.g. 1-1, 1-2, 2-1, 3-1, 3-2
  private findIdeaPosition(idea: Idea): string {
    const depth = idea.depth || 1;

    let position = 1;

    if (idea.parentId) {
      const parentIdea = this.findIdeaById(idea.parentId);

      if (parentIdea && parentIdea.children) {
        // Find position among siblings (children of the same parent)
        const siblingIndex = parentIdea.children.findIndex(
          (child) => child.id === idea.id
        );
        position = siblingIndex >= 0 ? siblingIndex + 1 : 1;
      }
    } else {
      // This is a root-level idea
      const rootIndex = this.children.findIndex((child) => child.id === idea.id);
      position = rootIndex >= 0 ? rootIndex + 1 : 1;
    }

    return `${depth}-${position}`;
  }

  private truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
}
