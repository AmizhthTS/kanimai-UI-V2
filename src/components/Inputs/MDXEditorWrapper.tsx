import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { getValueFromPath } from "../../utils";
import "../../mdx-editor.css";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertCodeBlock,
  ListsToggle,
  Separator,
} from "@mdxeditor/editor";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { useRef, useEffect } from "react";

interface MDXEditorWrapperProps {
  control: any;
  errors: any;
  name: string;
  textLable?: string;
  placeholderName?: string;
  labelMandatory?: boolean;
  requiredMsg?: string;
  validate?: any;
  minHeight?: string;
}

const MDXEditorWrapper = ({
  control,
  errors,
  name,
  textLable,
  placeholderName = "Write your content here...",
  labelMandatory,
  requiredMsg,
  validate,
  minHeight = "300px",
}: MDXEditorWrapperProps) => {
  const editorRef = useRef<MDXEditorMethods>(null);

  const hasError = errors?.[name];
  const errorMessage = hasError
    ? errors[name]?.message
    : name?.includes(".")
    ? getValueFromPath(errors, `${name}.message`)
    : "";

  return (
    <div className="space-y-2">
      {/* Label */}
      {textLable && (
        <Label htmlFor={name} className="flex items-center gap-1">
          {textLable} {labelMandatory && "*"}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={{
          required: requiredMsg,
          validate: validate,
        }}
        render={({ field }) => {
          // Ref to track the last value emitted by the editor to avoid loops
          const lastEmittedValue = useRef(field.value);

          // Sync external changes (like form reset) to the editor
          useEffect(() => {
            if (field.value !== lastEmittedValue.current) {
              editorRef.current?.setMarkdown(field.value || "");
              lastEmittedValue.current = field.value;
            }
          }, [field.value]);

          return (
            <div
              className={`mdx-editor-wrapper ${
                hasError
                  ? "mdx-editor-error border border-destructive rounded-md"
                  : ""
              }`}
              style={{ minHeight }}
            >
              <MDXEditor
                ref={editorRef}
                markdown={field.value || ""}
                onChange={(value) => {
                  lastEmittedValue.current = value;
                  field.onChange(value);
                }}
                placeholder={placeholderName}
                plugins={[
                  // Core plugins
                  headingsPlugin(),
                  listsPlugin(),
                  quotePlugin(),
                  thematicBreakPlugin(),
                  markdownShortcutPlugin(),

                  // Link plugins
                  linkPlugin(),
                  linkDialogPlugin(),

                  // Image plugin
                  imagePlugin({
                    imageUploadHandler: async (file) => {
                      // For now, return a placeholder URL
                      // In production, you'd upload to your server/cloud storage
                      return URL.createObjectURL(file);
                    },
                  }),

                  // Table plugin
                  tablePlugin(),

                  // Code block plugins
                  codeBlockPlugin({ defaultCodeBlockLanguage: "javascript" }),
                  codeMirrorPlugin({
                    codeBlockLanguages: {
                      javascript: "JavaScript",
                      typescript: "TypeScript",
                      python: "Python",
                      java: "Java",
                      css: "CSS",
                      html: "HTML",
                      json: "JSON",
                      bash: "Bash",
                    },
                  }),

                  // Toolbar plugin with all tools
                  toolbarPlugin({
                    toolbarContents: () => (
                      <>
                        <UndoRedo />
                        <Separator />
                        <BoldItalicUnderlineToggles />
                        <Separator />
                        <BlockTypeSelect />
                        <Separator />
                        <ListsToggle />
                        <Separator />
                        <CreateLink />
                        <InsertImage />
                        <Separator />
                        <InsertTable />
                        <InsertCodeBlock />
                      </>
                    ),
                  }),
                ]}
              />
            </div>
          );
        }}
      />

      {/* Error Message */}
      {errorMessage && (
        <p className="text-xs text-destructive">{errorMessage}</p>
      )}
    </div>
  );
};

export default MDXEditorWrapper;
