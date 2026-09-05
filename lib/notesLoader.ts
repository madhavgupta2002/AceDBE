/**
 * Utility to load markdown notes for a subject
 */

export async function loadNotes(subjectCode: string): Promise<string | null> {
  try {
    const response = await fetch(`/data/Subjects/${subjectCode}/NOTES.md`);

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

export async function loadShortNotes(subjectCode: string): Promise<string | null> {
  try {
    const response = await fetch(`/data/Subjects/${subjectCode}/SHORT_NOTES.md`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to load short notes: ${response.statusText}`);
    }

    const markdown = await response.text();
    return markdown;
  } catch (error) {
    console.error(`Error loading short notes for ${subjectCode}:`, error);
    return null;
  }
}
