import {type CollectionEntry, getCollection} from 'astro:content';

export async function getLocalizedCollection(
    collection: 'projects' | 'experiences' | 'education',
    locale: string
) {
    // Filter by folder structure: collection/fr/ or collection/en/
    const entries = await getCollection(collection, (entry) => {
        return entry.id.startsWith(`${locale}/`);
    });
    return entries;
}

export async function getLocalizedEntry(
    collection: 'projects' | 'experiences' | 'education',
    baseSlug: string,
    locale: string
): Promise<CollectionEntry<typeof collection> | undefined> {
    // Look for file in locale folder: collection/fr/slug.md or collection/en/slug.md
    const entries = await getCollection(collection, (entry) => {
        const slug = entry.id.replace(`${locale}/`, '').replace('.md', '');
        return entry.id.startsWith(`${locale}/`) && slug === baseSlug;
    });
    return entries[0];
}
