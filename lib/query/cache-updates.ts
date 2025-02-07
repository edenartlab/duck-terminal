import { Agent, CollectionV2, CreationV2, ModelV2, TaskV2 } from '@edenlabs/eden-sdk'

export type GenericDocumentType = {
  _id: string
}

export interface IEntity {
  _id: string
}

export type RowItem = CreationV2 | ModelV2 | TaskV2 | CollectionV2 | Agent

export type PageData<PageType> = {
  pageParams: number[]
  pages: PageType[]
}

export interface IPage<ItemType = IEntity> {
  docs?: ItemType[]
}

export type GenericPageType = IPage<RowItem>
export const addDocIfNotExistInPage = <T extends GenericDocumentType>(
  docUpdate: T,
  updatedPages: IPage<T>[],
): IPage<T>[] => {
  if (!docUpdate._id || !Array.isArray(updatedPages)) {
    return updatedPages
  }

  // Check if the document already exists in any page
  const exists = updatedPages.some(
    page =>
      Array.isArray(page.docs) &&
      page.docs.some(doc => doc._id === docUpdate._id),
  )

  if (!exists) {
    // Clone the first page or create a new one if it doesn't exist
    const firstPage = updatedPages[0] || { docs: [] }

    // Prepend the new document to the first page's docs
    const newDocs = [docUpdate, ...(firstPage.docs || [])]

    // Return the updated pages with the new document at the beginning
    return [
      {
        ...firstPage,
        docs: newDocs,
      },
      ...updatedPages.slice(1),
    ]
  }

  // If the document already exists, return the pages unchanged
  return updatedPages
}

export const updateDocInPage = <T extends GenericDocumentType>(
  docUpdate: T,
  updatedPages: IPage<T>[],
): IPage<T>[] => {
  if (!docUpdate._id || !Array.isArray(updatedPages)) {
    return updatedPages
  }
  return updatedPages.map(page => {
    return {
      ...page,
      docs: Array.isArray(page?.docs)
        ? page.docs.map(doc => (doc._id === docUpdate._id ? docUpdate : doc))
        : undefined,
    }
  })
}
