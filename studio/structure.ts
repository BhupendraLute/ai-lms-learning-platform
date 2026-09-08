import type { StructureResolver } from 'sanity/structure'
import { BookOpen, Folder, User, Video } from 'lucide-react'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('AI-LMS Content')
    .items([
      S.listItem()
        .title('Courses')
        .icon(BookOpen)
        .schemaType('course')
        .child(S.documentTypeList('course').title('Courses')),

      S.listItem()
        .title('Lessons')
        .icon(Video)
        .schemaType('lesson')
        .child(S.documentTypeList('lesson').title('Lessons')),

      S.divider(),

      S.listItem()
        .title('Instructors')
        .icon(User)
        .schemaType('instructor')
        .child(S.documentTypeList('instructor').title('Instructors')),

      S.listItem()
        .title('Categories')
        .icon(Folder)
        .schemaType('category')
        .child(S.documentTypeList('category').title('Categories')),

      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        return id && !['course', 'lesson', 'instructor', 'category'].includes(id)
      }),
    ])
