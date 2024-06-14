import { Extension } from '@tiptap/core'

export const getSelectedText = Extension.create({
   addCommands: () => {
       return {
           getSelectedText: () => ({ editor }) => {
               const { from, to, empty } = editor.state.selection

               if (empty) {
                   return null
               }

               return editor.state.doc.textBetween(from, to, ' ')
           },
       }
   }
})