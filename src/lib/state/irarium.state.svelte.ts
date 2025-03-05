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
  // idea to push new idea to
  lastIdeaId = $state('');
  lastIdea = $derived(this.lastIdeaId ? this.findIdeaById(this.lastIdeaId) : undefined);

  optionsParentIdeaIds = $derived(this.buildOptionsParentIdeaIds());

  constructor() {}

  setContent(content: string) {
    this.content = content;
  }

  addToIrarium(content: string, parentIdea?: Idea) {
    const idea = this.mapContentToIdea(content, parentIdea);

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

  private mapContentToIdea(content: string, parent?: Idea) {
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

  private buildOptionsParentIdeaIds() {
    // Helper function to recursively collect all ideas
    const collectAllIdeas = (ideas: Idea[]): { label: string; value: string }[] => {
      return ideas.flatMap((idea) => {
        const position = this.findIdeaPosition(idea);

        const label = `${position} ${this.truncateContent(idea?.content, 8)}`;

        return [{ label, value: idea.id }, ...collectAllIdeas(idea.children)];
      });
    };

    return [{ label: 'Root', value: '' }, ...collectAllIdeas(this.children)];
  }

  private findIdeaPosition(idea: Idea): string {
    const depth = idea.depth || 1;

    // Find the position among siblings under the same parent
    let position = 1; // Default to 1

    if (idea.parentId) {
      // Find the parent
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
  getParentChain() {
    if (!this.lastIdeaId) {
      return [];
    }

    // Drill down children from top until targetId is found, recording the path
    const findParentChain = (ideas, targetId, currentPath = [] as Idea[]) => {
      for (const idea of ideas) {
        // Check if this idea is the target
        if (idea.id === targetId) {
          return [...currentPath, idea];
        }

        // Check children if they exist
        if (idea.children && idea.children.length > 0) {
          const parentChain = findParentChain(idea.children, targetId, [
            ...currentPath,
            idea
          ]);

          if (parentChain) return parentChain;
        }
      }

      return null;
    };

    // Start with root if it exists
    let startingIdeas = this.children;
    let startingPath = [];

    const parentChain = findParentChain(startingIdeas, this.lastIdeaId, startingPath);

    // Return all but the last item (which is the active parent itself)
    // and ensure no duplicates
    if (!parentChain || parentChain?.length === 0) return [];

    // creates a new array that includes all elements from the original parentChain except the last one
    const uniqueChain = parentChain.slice(0, -1);

    return uniqueChain;
  }

  // Check if there's a sibling to the left
  hasSiblingLeft() {
    if (!this.lastIdeaId) return false;

    const siblings = this.getSiblings();
    if (siblings.length <= 1) return false;

    const currentIndex = siblings.findIndex((idea) => idea.id === this.lastIdeaId);
    return currentIndex > 0;
  }

  // Check if there's a sibling to the right
  hasSiblingRight() {
    if (!this.lastIdeaId) return false;

    const siblings = this.getSiblings();
    if (siblings.length <= 1) return false;

    const currentIndex = siblings.findIndex((idea) => idea.id === this.lastIdeaId);
    return currentIndex < siblings.length - 1;
  }

  // Get all siblings of last idea
  getSiblings() {
    if (!this.lastIdeaId) return [];

    // Helper function to find parent of an idea
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

    // Start with root if it exists
    let startingIdeas = this.children;

    const parent = findParent(startingIdeas, this.lastIdeaId);

    if (!parent) {
      return startingIdeas; // If no parent, must be at root level
    }

    return parent.children || [];
  }

  // Get children of the active parent
  getLastIdeaChildren() {
    if (!this.lastIdeaId) {
      return this.children;
    }

    // find children of a specific idea
    const findChildrenOfIdea = (ideas, targetId) => {
      for (const idea of ideas) {
        if (idea.id === targetId) {
          return idea.children || [];
        }

        if (idea.children && idea.children.length > 0) {
          const children = findChildrenOfIdea(idea.children, targetId);
          if (children) return children;
        }
      }

      return null;
    };

    // Start with root if it exists
    let startingIdeas = this.children;

    if (this.hasContent) {
      if (this.lastIdeaId === this.id) {
        return this.children;
      }
    }

    const children = findChildrenOfIdea(startingIdeas, this.lastIdeaId);

    return children || [];
  }

  getChildChain() {
    if (!this.lastIdeaId) {
      return [];
    }

    // Helper function to get the first child at each level
    const buildChildChain = (idea: Idea, chain: Idea[] = []): Idea[] => {
      // If the idea has no children, return the current chain
      if (!idea.children || idea.children.length === 0) {
        return chain;
      }

      // Get the first child
      const firstChild = idea.children[0];

      // Add it to the chain
      const updatedChain = [...chain, firstChild];

      // Continue building the chain with this child's first child
      return buildChildChain(firstChild, updatedChain);
    };

    // Get the last idea
    const lastIdea = this.findIdeaById(this.lastIdeaId);

    if (!lastIdea) {
      return [];
    }

    // Build and return the chain starting from the last idea
    return buildChildChain(lastIdea, []);
  }
}
