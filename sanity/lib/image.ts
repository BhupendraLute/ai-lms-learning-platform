import {
  createImageUrlBuilder,
  type ImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url'
import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

// Chainable builder. Add transforms and call `.url()` yourself, e.g.
// `urlFor(source).width(600).url()`.
export const urlFor = (source: SanityImageSource): ImageUrlBuilder => {
  return builder.image(source)
}

// Finished URL string, or undefined when the source is missing or invalid.
// The result is not chainable, so `imageUrl(source).width(...)` fails to compile.
export const imageUrl = (source?: SanityImageSource): string | undefined => {
  if (!source) return undefined
  try {
    return builder.image(source).auto('format').fit('max').url()
  } catch {
    return undefined
  }
}
