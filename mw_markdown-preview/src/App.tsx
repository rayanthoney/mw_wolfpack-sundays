// Importing React and useState hook from the React library
import React, { useState } from "react";
// Importing the marked function from the marked library to convert markdown to HTML
import { marked } from "marked";
// Importing DOMPurify to protect against Cross-Site-Scripting attacks (XSS)
import DOMPurify from "dompurify";


import "./App.css";

// Defining the MarkdownEditor component as a functional component
const MarkdownEditor: React.FC = () => {
  // Using the useState hook to create a state variable 'markdown' with a set function called 'setMarkdown'
  // The state holds the current value of the markdown text
  const [markdown, setmarkdown] = useState<string>("");

  // Event handler for changes in the input box
  // This function is called every time the user types in the input box
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setmarkdown(e.target.value);
  };

  // Function to export the markdown content to a file
  const exportToFile = () => {
    // Creating a new Blob object containing the markdown data
    const blob = new Blob([markdown], { type: "text/markdown" });
    // Creating an anchor element (<a>) programmatically
    const link = document.createElement('a')
    // Setting the filename for the downloaded file
    link.download = 'markdown-export.md'
    // Creating a URL for the blob and setting it as the href of the link
    link.href = window.URL.createObjectURL(blob)
    // Triggering the download by programmatically clicking the link
    link.click() 
    // Removing the link from the DOM
    link.remove()
  };

  const createSanitizedOutput = () => {
    //run user text through the Markdown processor
    const rawMarkup = marked(markdown);
    //Sanitize the Markdown to remove any XSS
    const sanitizesMarkup = DOMPurify.sanitize(rawMarkup);
    //Return the result
    return { __html: sanitizesMarkup };
  };

  // The component's rendered JSX
  return (
    <div className="markdown-editor-container">
      <h1 className="editor-title">Markdown Live - Demo</h1>
      <textarea
        className="editor-input"
        value={markdown}
        onChange={handleInputChange}
        placeholder="Enter Markdown here..."
      ></textarea>

      <div
        className="markdown-preview"
        dangerouslySetInnerHTML={createSanitizedOutput()}
      ></div>
      <button onClick={exportToFile} className="export-button">
        Export to File
      </button>
    </div>
  );
};

// Exporting the MarkdownEditor component for use in other parts of the application
export default MarkdownEditor;
