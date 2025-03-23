
import { useState, useMemo } from "react";
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write something..."
}) => {
  const [selection, setSelection] = useState<{start: number, end: number} | null>(null);
  const [editorHtml, setEditorHtml] = useState(value);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  
  // Update parent component when editor content changes
  const handleChange = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    setEditorHtml(html);
    onChange(html);
  };
  
  // Track selection for formatting commands
  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setSelection({
        start: range.startOffset,
        end: range.endOffset
      });
    }
  };
  
  // Formatting commands
  const applyFormat = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    const editor = document.getElementById('rich-text-editor');
    if (editor) {
      setEditorHtml(editor.innerHTML);
      onChange(editor.innerHTML);
    }
  };
  
  // Link handling
  const addLink = () => {
    if (linkUrl && linkText) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      document.execCommand('insertHTML', false, linkHtml);
      setLinkUrl("");
      setLinkText("");
      const editor = document.getElementById('rich-text-editor');
      if (editor) {
        setEditorHtml(editor.innerHTML);
        onChange(editor.innerHTML);
      }
    }
  };
  
  // Focus handling to maintain selection
  const handleFocus = () => {
    document.addEventListener('selectionchange', handleSelectionChange);
  };
  
  const handleBlur = () => {
    document.removeEventListener('selectionchange', handleSelectionChange);
  };
  
  // Toolbar for formatting options
  const toolbar = useMemo(() => (
    <div className="flex flex-wrap items-center gap-1 mb-2 border-b pb-2">
      <Toggle 
        aria-label="Bold" 
        onPressedChange={() => applyFormat('bold')}
        size="sm"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      
      <Toggle 
        aria-label="Italic" 
        onPressedChange={() => applyFormat('italic')}
        size="sm"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      
      <Toggle 
        aria-label="Underline" 
        onPressedChange={() => applyFormat('underline')}
        size="sm"
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      
      <Toggle 
        aria-label="Bulleted List" 
        onPressedChange={() => applyFormat('insertUnorderedList')}
        size="sm"
      >
        <List className="h-4 w-4" />
      </Toggle>
      
      <Toggle 
        aria-label="Numbered List" 
        onPressedChange={() => applyFormat('insertOrderedList')}
        size="sm"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      
      <Toggle 
        aria-label="Align Left" 
        onPressedChange={() => applyFormat('justifyLeft')}
        size="sm"
      >
        <AlignLeft className="h-4 w-4" />
      </Toggle>
      
      <Toggle 
        aria-label="Align Center" 
        onPressedChange={() => applyFormat('justifyCenter')}
        size="sm"
      >
        <AlignCenter className="h-4 w-4" />
      </Toggle>
      
      <Toggle 
        aria-label="Align Right" 
        onPressedChange={() => applyFormat('justifyRight')}
        size="sm"
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8 p-0">
            <Link className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="link-text">Link Text</Label>
              <Input 
                id="link-text" 
                value={linkText} 
                onChange={(e) => setLinkText(e.target.value)} 
                placeholder="Text to display" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input 
                id="link-url" 
                value={linkUrl} 
                onChange={(e) => setLinkUrl(e.target.value)} 
                placeholder="https://example.com" 
              />
            </div>
            <Button onClick={addLink}>Add Link</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ), [linkText, linkUrl]);

  return (
    <div className="rounded-md border border-input bg-background w-full">
      {toolbar}
      <div
        id="rich-text-editor"
        className="min-h-[100px] px-3 py-2 text-sm focus-visible:outline-none"
        contentEditable
        onInput={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        dangerouslySetInnerHTML={{ __html: editorHtml }}
        data-placeholder={placeholder}
        style={{
          minHeight: "100px"
        }}
      />
    </div>
  );
};
