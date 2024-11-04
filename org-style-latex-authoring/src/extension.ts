import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const decorationTypes = createDecorationTypes();
    const foldingProvider = new HierarchicalFoldingProvider();
    const selector: vscode.DocumentSelector = { language: 'latex' };

    // Register Folding Range Provider
    context.subscriptions.push(
        vscode.languages.registerFoldingRangeProvider(selector, foldingProvider)
    );

    // Register Decoration Update on Active Editor Change and Document Changes
    if (vscode.window.activeTextEditor) {
        updateDecorations(vscode.window.activeTextEditor, decorationTypes);
    }

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                updateDecorations(editor, decorationTypes);
            }
        }, null, context.subscriptions)
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                updateDecorations(editor, decorationTypes);
            }
        }, null, context.subscriptions)
    );
}

function createDecorationTypes() {
    // Define color codes
    const hierarchyColors = [
        '#007F00', // Level 1
        '#66BB6A', // Level 2
        '#B2E0B2', // Level 3
        '#B2E0B2', // Level 4
        '#B2E0B2'  // Level 5
    ];

    const todoColors = [
        '#A52A2A', // Level 1 (lighter red)
        '#D15D5D', // Level 2
        '#E1B2B5', // Level 3
        '#E1B2B5', // Level 4
        '#E1B2B5'  // Level 5
    ];

    const decorations: { [key: string]: vscode.TextEditorDecorationType } = {};

    // Chapters
    decorations['chapter'] = vscode.window.createTextEditorDecorationType({
        backgroundColor: '#BA68C8',
        fontWeight: 'bold',
        color: '#000000',
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
    });

    // Hierarchy Levels
    for (let i = 1; i <= 5; i++) {
        decorations[`section_${i}`] = vscode.window.createTextEditorDecorationType({
            backgroundColor: hierarchyColors[i - 1],
            fontWeight: 'bold',
            color: '#000000',
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });

        decorations[`todo_section_${i}`] = vscode.window.createTextEditorDecorationType({
            backgroundColor: todoColors[i - 1],
            fontWeight: 'bold',
            color: '#000000',
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });
    }

    // Questions
    decorations['question'] = vscode.window.createTextEditorDecorationType({
        color: '#0091EA',
        fontStyle: 'italic'
    });

    // Carets (^ comments)
    decorations['caret'] = vscode.window.createTextEditorDecorationType({
        color: '#AF4C50'
    });

    return decorations;
}

class HierarchicalFoldingProvider implements vscode.FoldingRangeProvider {
    private chapterPattern = /^%\s*#\s+/;
    private sectionPattern = /^%\s*(\*{1,5})\s+/;

    provideFoldingRanges(
        document: vscode.TextDocument,
        context: vscode.FoldingContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.FoldingRange[]> {
        const lines = document.getText().split(/\r?\n/);
        const foldingRanges: vscode.FoldingRange[] = [];
        const stack: { level: number, start: number }[] = [];

        lines.forEach((line, idx) => {
            let match = this.chapterPattern.exec(line);
            if (match) {
                const level = 0; // Chapters have the highest level
                while (stack.length > 0 && stack[stack.length - 1].level >= level) {
                    const last = stack.pop()!;
                    if (last.start < idx - 1) {
                        foldingRanges.push(new vscode.FoldingRange(last.start, idx - 1));
                    }
                }
                stack.push({ level, start: idx });
                return;
            }

            match = this.sectionPattern.exec(line);
            if (match) {
                const level = match[1].length; // Number of asterisks determines level
                while (stack.length > 0 && stack[stack.length - 1].level >= level) {
                    const last = stack.pop()!;
                    if (last.start < idx - 1) {
                        foldingRanges.push(new vscode.FoldingRange(last.start, idx - 1));
                    }
                }
                stack.push({ level, start: idx });
            }
        });

        // Close any remaining folds
        while (stack.length > 0) {
            const last = stack.pop()!;
            if (last.start < lines.length - 1) {
                foldingRanges.push(new vscode.FoldingRange(last.start, lines.length - 1));
            }
        }

        return foldingRanges;
    }
}

function updateDecorations(
    editor: vscode.TextEditor,
    decorations: { [key: string]: vscode.TextEditorDecorationType }
) {
    const document = editor.document;
    const lines = document.getText().split(/\r?\n/);

    const decorationOptions: { [key: string]: vscode.DecorationOptions[] } = {
        'chapter': [],
        'section_1': [],
        'section_2': [],
        'section_3': [],
        'section_4': [],
        'section_5': [],
        'todo_section_1': [],
        'todo_section_2': [],
        'todo_section_3': [],
        'todo_section_4': [],
        'todo_section_5': [],
        'question': [],
        'caret': []
    };

    const chapterPattern = /^%\s*#\s+/;
    const sectionPattern = /^%\s*(\*{1,5})\s+/;
    const questionPattern = /^%\s*\?\s+/;
    const caretPattern = /^%\s*\^\s+/;

    lines.forEach((line, idx) => {
        let decorationKey: string | null = null;

        if (chapterPattern.test(line)) {
            decorationKey = 'chapter';
        } else {
            const sectionMatch = sectionPattern.exec(line);
            if (sectionMatch) {
                const level = sectionMatch[1].length;
                if (line.includes('§')) {
                    decorationKey = `todo_section_${level}`;
                } else {
                    decorationKey = `section_${level}`;
                }
            }
        }

        if (decorationKey) {
            decorationOptions[decorationKey].push({
                range: new vscode.Range(idx, 0, idx, line.length)
            });
            return;
        }

        if (questionPattern.test(line)) {
            decorationOptions['question'].push({
                range: new vscode.Range(idx, 0, idx, line.length)
            });
            return;
        }

        if (caretPattern.test(line)) {
            decorationOptions['caret'].push({
                range: new vscode.Range(idx, 0, idx, line.length)
            });
            return;
        }
    });

    // Apply Decorations
    for (const key in decorationOptions) {
        editor.setDecorations(decorations[key], decorationOptions[key]);
    }
}

export function deactivate() {}
