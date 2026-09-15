import { type SchemaTypeDefinition } from 'sanity'

import { categoryType } from './categoryType'
import { instructorType } from './instructorType'
import { resourceType } from './resourceType'
import { learningOutcomeType } from './learningOutcomeType'
import { blockContentType } from './blockContentType'
import { lessonType } from './lessonType'
import { moduleType } from './moduleType'
import { courseType } from './courseType'
import { videoType } from './videoType'
import { agentContextType } from './agentContextType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    courseType,
    lessonType,
    instructorType,
    categoryType,
    videoType,
    agentContextType,
    // Objects & Blocks
    moduleType,
    learningOutcomeType,
    resourceType,
    blockContentType,
  ],
}
