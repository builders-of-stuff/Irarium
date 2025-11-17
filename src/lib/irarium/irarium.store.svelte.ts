import { nanoid } from 'nanoid';

import type { Thought, Irarium } from '$lib/shared/shared.type';
import { DEFAULT_IRARIUM_ID } from '$lib/shared/shared.constant';

// For in-memory working irarium
export class IrariumStore {
  id = $state(DEFAULT_IRARIUM_ID);
  userId = $state('');
  created = $state('');
  updated = $state('');

  title = $state('');
  description = $state('');
  tags = $state('');
  content = $state('');
  children = $state<Thought[]>([]);
  isPublic = $state(false);

  inputContent = $state('');
  isEditing = $state(false);
  isAdding = $state(false);
  activeThoughtId = $state('');
  lastActiveThoughtId = $state('');

  referenceThoughtId = $derived(
    this.activeThoughtId || this.lastActiveThoughtId || this.id || ''
  );
  activeThought = $derived(
    this.activeThoughtId ? this.findThoughtById(this.activeThoughtId) : undefined
  );
  lastActiveThought = $derived(
    this.lastActiveThoughtId
      ? this.findThoughtById(this.lastActiveThoughtId)
      : undefined
  );
  referenceThought = $derived(
    this.referenceThoughtId ? this.findThoughtById(this.referenceThoughtId) : undefined
  );

  hasContent = $derived(this.content.length > 0);
  hasChildren = $derived(this.children.length > 0);
  allThoughtsAsOptions = $derived(this.allThoughtsToOptions());
  isEmptyIrarium = $derived(!this.hasContent && !this.hasChildren);
  thoughtsCount = $derived.by(() => this.getAllThoughts().length);

  constructor(irarium?: Partial<Irarium>) {
    if (irarium) {
      this.clearStore();
      // Object.assign(this, irarium); does not work... something to do with $state and proxies
      if (irarium.id) this.id = irarium.id;
      if (irarium.userId) this.userId = irarium.userId;
      if (irarium.created) this.created = irarium.created;
      if (irarium.updated) this.updated = irarium.updated;
      if (irarium.title) this.title = irarium.title;
      if (irarium.description) this.description = irarium.description;
      if (irarium.tags) this.tags = irarium.tags;
      if (irarium.content) this.content = irarium.content;
      if (irarium.children) this.children = irarium.children;
      if (irarium.isPublic !== undefined) this.isPublic = irarium.isPublic;
    }
  }

  clearStore() {
    this.id = DEFAULT_IRARIUM_ID;
    this.userId = '';
    this.created = '';
    this.updated = '';
    this.title = '';
    this.description = '';
    this.tags = '';
    this.content = '';
    this.children = [];
    this.isPublic = false;
    this.inputContent = '';
    this.isEditing = false;
    this.isAdding = false;
    this.activeThoughtId = '';
    this.lastActiveThoughtId = '';
  }

  setContent(content: string) {
    this.content = content;
  }

  setActiveThoughtId(thoughtId: string) {
    this.lastActiveThoughtId = this.activeThoughtId
      ? this.activeThoughtId
      : this.lastActiveThoughtId;
    this.activeThoughtId = thoughtId;
  }

  clearActiveThoughtId() {
    this.lastActiveThoughtId = this.activeThoughtId
      ? this.activeThoughtId
      : this.lastActiveThoughtId;
    this.activeThoughtId = '';
  }

  setLastActiveThoughtId(thoughtId: string) {
    this.lastActiveThoughtId = thoughtId;
  }

  setIsEditing(isEditing: boolean) {
    this.isEditing = isEditing;
  }

  setIsAdding(isAdding: boolean) {
    this.isAdding = isAdding;
  }

  addThought(content: string, activeThought?: Thought) {
    const thought = this.buildNewThought(content, activeThought);

    if (!activeThought?.id) {
      // If no parent, add directly to root level
      this.children = [...this.children, thought];
    } else {
      const parentId = activeThought.id;
      const parent = this.findThoughtById(parentId);

      if (parent) {
        const updatedParent = {
          ...parent,
          children: [...parent.children, thought]
        };

        this.children = this.updateThoughtById(parentId, updatedParent);
      }
    }

    this.setActiveThoughtId(thought.id);

    return thought;
  }

  findThoughtById(
    id: string,
    thoughts: Thought[] = this.children
  ): Thought | undefined {
    const directMatch = thoughts.find((thought) => thought.id === id);

    if (directMatch) return directMatch;

    return thoughts.flatMap((thought) => thought.children).length > 0
      ? this.findThoughtById(
          id,
          thoughts.flatMap((thought) => thought.children)
        )
      : undefined;
  }

  updateThoughtById(
    id: string,
    updatedThought: Thought,
    thoughts: Thought[] = this.children
  ): Thought[] {
    return thoughts.map((thought) => {
      if (thought.id === id) {
        return updatedThought;
      }

      if (thought.children.length > 0) {
        return {
          ...thought,
          children: this.updateThoughtById(id, updatedThought, thought.children)
        };
      }

      return thought;
    });
  }

  // Get all thoughts in flat array (exclude root)
  getAllThoughts() {
    let allThoughts = [] as any[];

    const collectThoughts = (thoughts) => {
      for (const thought of thoughts) {
        allThoughts = [...allThoughts, thought];
        if (thought.children && thought.children.length > 0) {
          collectThoughts(thought.children);
        }
      }
    };

    collectThoughts(this.children);

    return allThoughts;
  }

  getSiblingThoughts(parentId) {
    const allThoughts = this.getAllThoughts();
    const parentThought = allThoughts.find((thought) => thought.id === parentId);

    if (!parentThought || !parentThought?.children) {
      return [];
    }

    return parentThought.children;
  }

  // Get chain of parent thoughts (excludes last thought & root)
  getParentChain(thoughtId = this.referenceThoughtId) {
    if (!thoughtId) {
      return [];
    }

    const buildParentChain = (
      thoughts: Thought[],
      targetId: string,
      currentPath: Thought[] = []
    ) => {
      for (const thought of thoughts) {
        if (thought.id === targetId) {
          return [...currentPath, thought];
        }

        if (thought.children && thought.children.length > 0) {
          const parentChain = buildParentChain(thought.children, targetId, [
            ...currentPath,
            thought
          ]);

          if (parentChain) return parentChain;
        }
      }

      return null;
    };

    const startingThoughts = this.children;
    const startingPath = [];

    const parentChain = buildParentChain(startingThoughts, thoughtId, startingPath);

    if (!parentChain || parentChain?.length === 0) return [];

    // Exclude last thought because it's not a "parent"
    const uniqueChain = parentChain.slice(0, -1);

    return uniqueChain;
  }

  getChildChain(thoughtId = this.referenceThoughtId, index = 0) {
    const id = thoughtId;
    const chain = [] as Thought[];
    const preferredIndex = index;

    const buildChildChain = (
      thought?: Thought,
      chain: Thought[] = [],
      isFirstIteration = false
    ): Thought[] => {
      // Use preferredIndex only for the first iteration, then default to 0
      const childIndex = isFirstIteration ? preferredIndex : 0;

      const children = thought ? thought.children : this.children;
      const targetChild = children[childIndex] || children[0];

      if (!targetChild) return chain;

      const updatedChain = [...chain, targetChild];

      return buildChildChain(targetChild, updatedChain);
    };

    const lastThought = this.findThoughtById(id);
    const childChain = buildChildChain(lastThought, chain, true);

    return childChain;
  }

  hasSiblingLeft(thoughtId = this.referenceThoughtId) {
    if (!thoughtId) return false;

    const siblings = this.getSiblings(thoughtId);
    if (siblings.length <= 1) return false;

    const currentIndex = siblings.findIndex((thought) => thought.id === thoughtId);
    return currentIndex > 0;
  }

  hasSiblingRight(thoughtId = this.referenceThoughtId) {
    if (!thoughtId) return false;

    const siblings = this.getSiblings(thoughtId);
    if (siblings.length <= 1) return false;

    const currentIndex = siblings.findIndex((thought) => thought.id === thoughtId);
    return currentIndex < siblings.length - 1;
  }

  getSiblings(thoughtId = this.referenceThoughtId) {
    if (!thoughtId || thoughtId === this.id) return [];

    const findParent = (thoughts, targetId, parent = null) => {
      for (const thought of thoughts) {
        if (thought.id === targetId) {
          return parent;
        }

        if (thought.children && thought.children.length > 0) {
          const foundParent = findParent(thought.children, targetId, thought);
          if (foundParent) return foundParent;
        }
      }

      return null;
    };

    const startingThoughts = this.children;

    const parent = findParent(startingThoughts, thoughtId);

    if (!parent) {
      return startingThoughts;
    }

    return parent.children || [];
  }

  // Add these new methods for sibling navigation
  getSiblingLeft(thoughtId = this.referenceThoughtId) {
    if (!thoughtId || thoughtId === this.id) return null;

    const siblings = this.getSiblings(thoughtId);
    const currentIndex = siblings.findIndex((thought) => thought.id === thoughtId);

    if (currentIndex > 0) {
      return siblings[currentIndex - 1];
    }

    return null;
  }

  getSiblingRight(thoughtId = this.referenceThoughtId) {
    if (!thoughtId || thoughtId === this.id) return null;

    const siblings = this.getSiblings(thoughtId);
    const currentIndex = siblings.findIndex((thought) => thought.id === thoughtId);

    if (currentIndex < siblings.length - 1) {
      return siblings[currentIndex + 1];
    }

    return null;
  }

  deleteThought(thoughtId: string) {
    // Don't allow deleting the root
    if (thoughtId === this.id) return;

    // Helper function to remove thought from an array of thoughts
    const removeThoughtFromArray = (thoughts: Thought[]): Thought[] => {
      return thoughts.filter((thought) => {
        if (thought.id === thoughtId) {
          return false;
        }
        thought.children = removeThoughtFromArray(thought.children);
        return true;
      });
    };

    // Update children array with thought removed
    this.children = removeThoughtFromArray(this.children);

    // Clean up all state
    this.activeThoughtId = '';
    this.lastActiveThoughtId = '';
    this.isEditing = false;
    this.isAdding = false;
  }

  private buildNewThought(content: string, activeThought?: Thought) {
    // eslint-disable-next-line svelte/prefer-svelte-reactivity -- Date is immediately converted to string, not used reactively
    const now = new Date().toISOString();
    const id = nanoid(5);
    const parentId = activeThought?.id;
    const depth = activeThought?.id ? activeThought.depth + 1 : 0;

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

  private allThoughtsToOptions() {
    const collectAllThoughts = (
      thoughts: Thought[]
    ): { label: string; value: string }[] => {
      return thoughts.flatMap((thought) => {
        const position = this.findThoughtPosition(thought);

        const label = `${position} ${this.truncateContent(thought?.content, 8)}`;

        return [{ label, value: thought.id }, ...collectAllThoughts(thought.children)];
      });
    };

    return [{ label: 'Root', value: this.id }, ...collectAllThoughts(this.children)];
  }

  // e.g. 1-1, 1-2, 2-1, 3-1, 3-2
  // 1st number is depth, 2nd number is index among siblings
  private findThoughtPosition(thought: Thought): string {
    const depth = thought.depth || 0;

    let index = 0;

    if (thought.parentId) {
      const parentThought = this.findThoughtById(thought.parentId);

      if (parentThought && parentThought.children) {
        // Find position among siblings (children of the same parent)
        const siblingIndex = parentThought.children.findIndex(
          (child) => child.id === thought.id
        );
        index = siblingIndex >= 0 ? siblingIndex : 0;
      }
    } else {
      // This is a root-level thought
      const rootIndex = this.children.findIndex((child) => child.id === thought.id);
      index = rootIndex >= 0 ? rootIndex : 0;
    }

    return `${depth}-${index}`;
  }

  private truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
}
