# Org-style LaTeX Authoring Highlighter

This Visual Studio Code extension enhances your LaTeX document authoring workflow by allowing you to define collapsible sections using comments. It provides a visual hierarchy for chapters and sections, making it easier to manage large documents.

## Features

- **Hierarchical Folding**: Create collapsible sections in your LaTeX documents using comments. Supports five levels of hierarchy:
  - Chapters: Defined with `% # Chapter`
  - Sections: Defined with `% * Section` through `% ***** Section`
- **TODO Sections**: Mark sections as TODO using the `§` symbol, and they will be highlighted in red.
- **Custom Decorations**: Each level of section has a distinct background color that helps visualize the hierarchy:
  - Chapters: Purple
  - Sections: Shades of green, with varying darkness based on the level.
  - TODO Sections: Shades of red.
- **Special Comments**: Comments starting with `?` are highlighted in blue and italicized, while those starting with `^` are highlighted in red. These comments do not participate in folding.
- **Persistent Highlighting**: Background color persists when sections are folded, keeping the hierarchy visually clear.

## Installation

1. Install Visual Studio Code if you haven't already.
2. Open VSCode and navigate to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side or by pressing `Ctrl+Shift+X`.
3. Search for "LaTeX Hierarchical Comment Folding" and click on the install button.
4. Alternatively, you can clone this repository and run the extension from the source. 

## Usage

1. Open a `.tex` file in VSCode.
2. Use the following comment formats to define your document structure:

   ```latex
   % # Chapter Title
   % * Section 1 Title
   % ** Section 1.1 Title
   % *** Section 1.1.1 Title
   % ** Section 1.2 Title
   % * Section 2 Title
   ```

3. To mark a section as TODO, include the `§` symbol:

   ```latex
   % ** Section 1.1 Title §
   ```

4. Add special comments:
   - For questions, use: 
     ```latex
     % ? This is a question
     ```
   - For caret comments, use:
     ```latex
     % ^ This is a caret comment
     ```

5. Collapse and expand sections by clicking the folding icons in the gutter next to the line numbers.

## Example

Here’s an example of how your LaTeX comments might look:

```latex
% # Introduction
% * Overview
% ** Background
% *** Previous Work
% ** Current Work §
% * Conclusion
% ? What next?
% ^ Note to self
```

## Customization

Feel free to modify the colors and styles in the `extension.ts` file to fit your preferences. The current color scheme is as follows:

- Chapters: `#BA68C8` (Purple)
- Section Levels:
  - Level 1: `#007F00` (Dark Green)
  - Level 2: `#66BB6A` (Medium Green)
  - Level 3-5: `#B2E0B2` (Light Green)
- TODO Section Levels:
  - Level 1: `#7A0000` (Dark Red)
  - Level 2: `#D15D5D` (Medium Red)
  - Level 3-5: `#E1B2B5` (Light Red)
- Questions: `#0091EA` (Bright Blue)
- Carets: `#AF4C50` (Red)

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to create an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the VSCode team for providing a robust extension API.
- Thanks o1-mini for generating everything. :')