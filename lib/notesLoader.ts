/**
 * Utility to load markdown notes for a subject
 */

import { getTermForSubject } from './subjectMapping';

export async function loadNotes(subjectCode: string): Promise<string | null> {
  try {
    // Get the term for this subject to find the correct folder
    const term = getTermForSubject(subjectCode);
    const response = await fetch(`/data/Notes/Term ${term}/${subjectCode}.md`);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Notes file not found for subject: ${subjectCode}`);
        return null;
      }
      throw new Error(`Failed to load notes: ${response.statusText}`);
    }

    const markdown = await response.text();
    return markdown;
  } catch (error) {
    console.error(`Error loading notes for ${subjectCode}:`, error);
    return null;
  }
}
