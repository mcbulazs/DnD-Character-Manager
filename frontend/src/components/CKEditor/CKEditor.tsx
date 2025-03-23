import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useEffect, useRef, useState } from "react";

import {
  AccessibilityHelp,
  Alignment,
  Autosave,
  Bold,
  ClassicEditor,
  type Editor,
  type EditorConfig,
  Essentials,
  type EventInfo,
  FontBackgroundColor,
  FontColor,
  FontSize,
  HorizontalLine,
  Indent,
  IndentBlock,
  Italic,
  Paragraph,
  RemoveFormat,
  SelectAll,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  Underline,
  Undo,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

import "./CKEditor.css";

const TextEditor: React.FC<{
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
  disabled?: boolean;
}> = ({ value, onChange, placeholder, disabled = false }) => {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const editorConfig: EditorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "fontSize",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "subscript",
        "superscript",
        "removeFormat",
        "|",
        "horizontalLine",
        "insertTable",
        "|",
        "alignment",
        "|",
        "outdent",
        "indent",
      ],
      shouldNotGroupWhenFull: true,
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      Autosave,
      Bold,
      Essentials,
      FontBackgroundColor,
      FontColor,
      FontSize,
      HorizontalLine,
      Indent,
      IndentBlock,
      Italic,
      Paragraph,
      RemoveFormat,
      SelectAll,
      Strikethrough,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      Underline,
      Undo,
    ],
    fontSize: {
      options: [10, 12, 14, "default", 18, 20, 22],
      supportAllValues: true,
    },
    placeholder: placeholder,
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
  };

  const handleEditorChange = (
    _event: EventInfo<string, unknown>,
    editor: Editor,
  ) => {
    const data = editor.getData();
    onChange(data);
  };

  return (
    <div>
      <div className="main-container">
        <div
          className="editor-container editor-container_classic-editor"
          ref={editorContainerRef}
        >
          <div className="editor-container__editor">
            <div ref={editorRef}>
              {isLayoutReady && (
                <CKEditor
                  disabled={disabled}
                  editor={ClassicEditor}
                  config={editorConfig}
                  data={value}
                  onChange={handleEditorChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
