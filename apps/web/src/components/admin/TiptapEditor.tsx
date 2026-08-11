import { useEffect, useRef } from 'react';
import { useEditor, EditorContent, type Content } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { FormatBold as FormatBoldIcon, FormatItalic as FormatItalicIcon, FormatListBulleted as FormatListBulletedIcon, FormatListNumbered as FormatListNumberedIcon } from '@mui/icons-material';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const prevValueRef = useRef(value);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value as Content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      prevValueRef.current = html;
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && value !== prevValueRef.current) {
      prevValueRef.current = value;
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const toggle = (format: string) => {
    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
    }
  };

  return (
    <Box>
      <ToggleButtonGroup size="small" sx={{ mb: 1 }}>
        <ToggleButton
          value="bold"
          selected={editor.isActive('bold')}
          onMouseDown={(e) => { e.preventDefault(); toggle('bold'); }}
        >
          <FormatBoldIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="italic"
          selected={editor.isActive('italic')}
          onMouseDown={(e) => { e.preventDefault(); toggle('italic'); }}
        >
          <FormatItalicIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="bulletList"
          selected={editor.isActive('bulletList')}
          onMouseDown={(e) => { e.preventDefault(); toggle('bulletList'); }}
        >
          <FormatListBulletedIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="orderedList"
          selected={editor.isActive('orderedList')}
          onMouseDown={(e) => { e.preventDefault(); toggle('orderedList'); }}
        >
          <FormatListNumberedIcon fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          minHeight: 300,
          '& .ProseMirror': { p: 2, minHeight: 280, outline: 'none' },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
