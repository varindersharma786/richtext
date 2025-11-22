'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { 
  Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Heading3, 
  ImageIcon, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Code 
} from 'lucide-react'
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { createClient } from '@/utils/supabase/client'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const supabase = createClient()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
    immediatelyRender: false,
  })

  if (!editor) {
    return null
  }

  const addImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, file)

        if (uploadError) {
          alert('Error uploading image: ' + uploadError.message)
          return
        }

        const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath)
        editor.chain().focus().setImage({ src: data.publicUrl }).run()
      }
    }
    input.click()
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="border border-input rounded-lg overflow-hidden bg-background">
      <div className="bg-muted/50 border-b border-input p-2 flex flex-wrap gap-2 items-center">
        <ToggleGroup type="multiple">
          <ToggleGroupItem 
            value="bold" 
            aria-label="Toggle bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-state={editor.isActive('bold') ? 'on' : 'off'}
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="italic" 
            aria-label="Toggle italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            data-state={editor.isActive('italic') ? 'on' : 'off'}
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="code" 
            aria-label="Toggle code"
            onClick={() => editor.chain().focus().toggleCode().run()}
            data-state={editor.isActive('code') ? 'on' : 'off'}
          >
            <Code className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" className="h-6" />

        <ToggleGroup type="single">
          <ToggleGroupItem 
            value="h1" 
            aria-label="Heading 1"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            data-state={editor.isActive('heading', { level: 1 }) ? 'on' : 'off'}
          >
            <Heading1 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="h2" 
            aria-label="Heading 2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            data-state={editor.isActive('heading', { level: 2 }) ? 'on' : 'off'}
          >
            <Heading2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="h3" 
            aria-label="Heading 3"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            data-state={editor.isActive('heading', { level: 3 }) ? 'on' : 'off'}
          >
            <Heading3 className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" className="h-6" />

        <ToggleGroup type="single">
          <ToggleGroupItem 
            value="bullet" 
            aria-label="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            data-state={editor.isActive('bulletList') ? 'on' : 'off'}
          >
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="ordered" 
            aria-label="Ordered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            data-state={editor.isActive('orderedList') ? 'on' : 'off'}
          >
            <ListOrdered className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" className="h-6" />

        <ToggleGroup type="single">
          <ToggleGroupItem 
            value="left" 
            aria-label="Align Left"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            data-state={editor.isActive({ textAlign: 'left' }) ? 'on' : 'off'}
          >
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="center" 
            aria-label="Align Center"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            data-state={editor.isActive({ textAlign: 'center' }) ? 'on' : 'off'}
          >
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="right" 
            aria-label="Align Right"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            data-state={editor.isActive({ textAlign: 'right' }) ? 'on' : 'off'}
          >
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="ghost" size="icon" onClick={setLink} className={editor.isActive('link') ? 'bg-accent' : ''}>
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-accent' : ''}>
          <Quote className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={addImage}>
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
