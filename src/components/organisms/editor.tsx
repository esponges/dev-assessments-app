import { useRef, useState } from 'react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { EditorProps, Monaco } from '@monaco-editor/react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { Button } from '../ui/button';

type Props = EditorProps & {
  value: string;
  language: string;
  onGetContent: (value: string) => void;
};

export const Editor = ({ value, ...props }: Props) => {
  const [language, setLanguage] = useState('javascript');
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    _monaco: Monaco
  ) => {
    editorRef.current = editor;
  };

  const showValue = () => {
    if (editorRef.current) {
      alert(editorRef.current.getValue());
    }
  };

  const onGetContent = (content: string) => {
    props.onGetContent(content);
  };

  return (
    <>
      <div className="editor">
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
          defaultValue="// some comment"
          onMount={handleEditorDidMount}
        />
        <Button className="mx-auto my-4" onClick={showValue}>CTA</Button>
      </div>
    </>
  );
};
