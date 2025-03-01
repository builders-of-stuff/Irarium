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
  children = $state<Idea[]>([]);

  constructor() {}

  setContent(content: string) {
    this.content = content;
  }

  addToIrarium(content: string, parentIdea?: Idea) {
    const idea = this.mapContentToIdea(content, parentIdea?.depth);

    if (!parentIdea?.id) {
      this.children = [...this.children, idea];
    } else {
      const depth = parentIdea.depth;
      const parentId = parentIdea.id;
    }
  }

  private mapContentToIdea(content: string, parentDepth?: number) {
    const now = new Date().toISOString();
    const depth = parentDepth ? parentDepth + 1 : 1;

    return {
      id: nanoid(5),
      content,
      children: [],
      depth,
      created: now,
      updated: now
    };
  }

  /**
   * e.g. {
  "id": "idea_root_id",
  "title": "Main Idea",
  "content": "Description of main idea",
  "children": [
    {
      "id": "child_idea_1",
      "title": "Child Idea 1",
      "content": "Description of child idea 1",
      "children": [
        {
          "id": "grandchild_1",
          "title": "Grandchild Idea 1",
          "content": "Description of grandchild idea 1",
          "children": []
        },
        {
          "id": "grandchild_2",
          "title": "Grandchild Idea 2",
          "content": "Description of grandchild idea 2",
          "children": [
            {
              "id": "great_grandchild_1",
              "title": "Great Grandchild Idea 1",
              "content": "Description of great grandchild idea 1",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "id": "child_idea_2",
      "title": "Child Idea 2",
      "content": "Description of child idea 2",
      "children": []
    }
  ]
}
   */
  private findIdeaById(id: string, ideas: Idea[] = this.children): Idea | undefined {
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

  /**
   * Recursively updates an idea by its ID in the nested structure
   * @param id The ID of the idea to update
   * @param updatedIdea The idea object to replace the existing idea with
   * @param ideas Optional array of ideas to search in (used for recursion)
   * @returns A new array with the updated idea, or the original array if not found
   */
  private updateIdeaById(
    id: string,
    updatedIdea: Idea,
    ideas: Idea[] = this.children
  ): Idea[] {
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
}
