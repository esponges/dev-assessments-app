import { useRef, useState } from 'react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { EditorProps, Monaco } from '@monaco-editor/react';
import { Editor as MonacoEditor } from '@monaco-editor/react';

import { Button } from '../ui/button';

type Props = EditorProps & {
  value?: string;
  language: string;
  isLoading?: boolean;
  CTALabel?: string;
  onContentSave?: (value: string) => void;
  onSubmit?: (value: string) => void;
};

export const Editor = ({
  value,
  onContentSave,
  isLoading,
  CTALabel,
  onSubmit,
  ...props
}: Props) => {
  const [language, setLanguage] = useState('javascript');
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    _monaco: Monaco
  ) => {
    editorRef.current = editor;
  };

  const handleChange = (content: string | undefined) => {
    if (!content || !onContentSave) return;
    onContentSave(content);
  };

  const handleSumit = () => {
    if (onSubmit && editorRef.current?.getValue()) {
      onSubmit(editorRef.current?.getValue());
    } else {
      alert('No content to submit');
    }
  };

  return (
    <>
      <div className="editor md:w-[80%] text-center">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="go">Go</option>
        </select>
        <MonacoEditor
          {...props}
          height="90vh"
          theme="vs-dark"
          defaultLanguage="typescript"
          language={language}
          defaultValue={value || '// please type your code here'}
          onMount={handleEditorDidMount}
          onChange={handleChange}
        />
        <Button
          className="mx-auto my-4"
          onClick={handleSumit}
          disabled={isLoading}
        >
          {CTALabel || 'Save'}
        </Button>
      </div>
    </>
  );
};
