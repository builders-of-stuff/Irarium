import { nanoid } from 'nanoid';

import type { Idea } from '$lib/shared/shared.type';
import { DEFAULT_IRARIUM_ID } from '$lib/shared/shared.constant';

import { authStore } from '../auth/auth.store.svelte';

// For current active irarium
export class IrariumStore {
  id = $state(DEFAULT_IRARIUM_ID);
  userId = $derived(authStore.userId);
  created = $state('');
  updated = $state('');

  title = $state('');
  description = $state('');
  tags = $state('');
  content = $state('');
  children = $state<Idea[]>([]);

  inputContent = $state('');
  isEditing = $state(false);
  isAdding = $state(true);
  activeIdeaId = $state('');
  lastActiveIdeaId = $state('');

  referenceIdeaId = $derived(
    this.activeIdeaId || this.lastActiveIdeaId || this.id || ''
  );
  activeIdea = $derived(
    this.activeIdeaId ? this.findIdeaById(this.activeIdeaId) : undefined
  );
  lastActiveIdea = $derived(
    this.lastActiveIdeaId ? this.findIdeaById(this.lastActiveIdeaId) : undefined
  );
  referenceIdea = $derived(
    this.referenceIdeaId ? this.findIdeaById(this.referenceIdeaId) : undefined
  );

  hasContent = $derived(this.content.length > 0);
  hasChildren = $derived(this.children.length > 0);
  allIdeasAsOptions = $derived(this.allIdeasToOptions());
  isEmptyIrarium = $derived(!this.hasContent && !this.hasChildren);

  constructor() {}

  setContent(content: string) {
    this.content = content;
  }

  setActiveIdeaId(ideaId: string) {
    this.lastActiveIdeaId = this.activeIdeaId
      ? this.activeIdeaId
      : this.lastActiveIdeaId;
    this.activeIdeaId = ideaId;
  }

  clearActiveIdeaId() {
    this.lastActiveIdeaId = this.activeIdeaId
      ? this.activeIdeaId
      : this.lastActiveIdeaId;
    this.activeIdeaId = '';
  }

  setLastActiveIdeaId(ideaId: string) {
    this.lastActiveIdeaId = ideaId;
  }

  setIsEditing(isEditing: boolean) {
    this.isEditing = isEditing;
  }

  setIsAdding(isAdding: boolean) {
    this.isAdding = isAdding;
  }

  addIdea(content: string, activeIdea?: Idea) {
    const idea = this.buildNewIdea(content, activeIdea);

    if (!activeIdea?.id) {
      // If no parent, add directly to root level
      this.children = [...this.children, idea];
    } else {
      const parentId = activeIdea.id;
      const parent = this.findIdeaById(parentId);

      if (parent) {
        const updatedParent = {
          ...parent,
          children: [...parent.children, idea]
        };

        this.children = this.updateIdeaById(parentId, updatedParent);
      }
    }

    this.setActiveIdeaId(idea.id);

    return idea;
  }

  findIdeaById(id: string, ideas: Idea[] = this.children): Idea | undefined {
    const directMatch = ideas.find((idea) => idea.id === id);

    if (directMatch) return directMatch;

    return ideas.flatMap((idea) => idea.children).length > 0
      ? this.findIdeaById(
          id,
          ideas.flatMap((idea) => idea.children)
        )
      : undefined;
  }

  updateIdeaById(id: string, updatedIdea: Idea, ideas: Idea[] = this.children): Idea[] {
    return ideas.map((idea) => {
      if (idea.id === id) {
        return updatedIdea;
      }

      if (idea.children.length > 0) {
        return {
          ...idea,
          children: this.updateIdeaById(id, updatedIdea, idea.children)
        };
      }

      return idea;
    });
  }

  // Get all ideas in flat array (exclude root)
  getAllIdeas() {
    let allIdeas = [] as any[];

    const collectIdeas = (ideas) => {
      for (const idea of ideas) {
        allIdeas = [...allIdeas, idea];
        if (idea.children && idea.children.length > 0) {
          collectIdeas(idea.children);
        }
      }
    };

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
  getParentChain(ideaId = this.referenceIdeaId) {
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

  getChildChain(ideaId = this.referenceIdeaId, index = 0) {
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

  hasSiblingLeft(ideaId = this.referenceIdeaId) {
    if (!ideaId) return false;

    const siblings = this.getSiblings(ideaId);
    if (siblings.length <= 1) return false;

    const currentIndex = siblings.findIndex((idea) => idea.id === ideaId);
    return currentIndex > 0;
  }

  hasSiblingRight(ideaId = this.referenceIdeaId) {
    if (!ideaId) return false;

    const siblings = this.getSiblings(ideaId);
    if (siblings.length <= 1) return false;

    const currentIndex = siblings.findIndex((idea) => idea.id === ideaId);
    return currentIndex < siblings.length - 1;
  }

  getSiblings(ideaId = this.referenceIdeaId) {
    if (!ideaId || ideaId === this.id) return [];

    const findParent = (ideas, targetId, parent = null) => {
      for (const idea of ideas) {
        if (idea.id === targetId) {
          return parent;
        }

        if (idea.children && idea.children.length > 0) {
          const foundParent = findParent(idea.children, targetId, idea);
          if (foundParent) return foundParent;
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

  // Add these new methods for sibling navigation
  getSiblingLeft(ideaId = this.referenceIdeaId) {
    if (!ideaId || ideaId === this.id) return null;

    const siblings = this.getSiblings(ideaId);
    const currentIndex = siblings.findIndex((idea) => idea.id === ideaId);

    if (currentIndex > 0) {
      return siblings[currentIndex - 1];
    }

    return null;
  }

  getSiblingRight(ideaId = this.referenceIdeaId) {
    if (!ideaId || ideaId === this.id) return null;

    const siblings = this.getSiblings(ideaId);
    const currentIndex = siblings.findIndex((idea) => idea.id === ideaId);

    if (currentIndex < siblings.length - 1) {
      return siblings[currentIndex + 1];
    }

    return null;
  }

  private buildNewIdea(content: string, activeIdea?: Idea) {
    const now = new Date().toISOString();
    const id = nanoid(5);
    const parentId = activeIdea?.id;
    const depth = activeIdea?.id ? activeIdea.depth + 1 : 0;

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

    return [{ label: 'Root', value: this.id }, ...collectAllIdeas(this.children)];
  }

  // e.g. 1-1, 1-2, 2-1, 3-1, 3-2
  // 1st number is depth, 2nd number is index among siblings
  private findIdeaPosition(idea: Idea): string {
    const depth = idea.depth || 0;

    let index = 0;

    if (idea.parentId) {
      const parentIdea = this.findIdeaById(idea.parentId);

      if (parentIdea && parentIdea.children) {
        // Find position among siblings (children of the same parent)
        const siblingIndex = parentIdea.children.findIndex(
          (child) => child.id === idea.id
        );
        index = siblingIndex >= 0 ? siblingIndex : 0;
      }
    } else {
      // This is a root-level idea
      const rootIndex = this.children.findIndex((child) => child.id === idea.id);
      index = rootIndex >= 0 ? rootIndex : 0;
    }

    return `${depth}-${index}`;
  }

  private truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
}
