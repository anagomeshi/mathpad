const MQ = MathQuill.getInterface(2);

document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.editable-field').forEach(function(editorElement) {
        setupMathField(editorElement);
        setupCopyButton(editorElement.closest('.line-editor'));
    });
});

function setupMathField(element){
    const mathField = MQ.MathField(element, {
        handlers: {
            enter: function(field){
                if(field.latex() === "") return;
                createNewLineAndFocus(field);
            },

            deleteOutOf: function(dir, field){
                if(dir === MQ.L){
                    if(field.latex() === ""){
                        const currentLineEditor = element.closest('.line-editor');

                        const prevLineEditor = currentLineEditor.previousElementSibling;

                        const nextLineEditor = currentLineEditor.nextElementSibling;

                        if(prevLineEditor){
                            const prevField = prevLineEditor.querySelector('.editable-field');
                            if(prevField && prevField.mathFieldInstance){
                                prevField.mathFieldInstance.focus();
                                prevField.mathFieldInstance.moveToDirEnd(MQ.R);
                            }

                            currentLineEditor.remove();
                        }else if(nextLineEditor){
                            const nextField = nextLineEditor.querySelector('.editable-field');
                            if(nextField && nextField.mathFieldInstance){
                                nextField.mathFieldInstance.focus();
                                nextField.mathFieldInstance.moveToDirEnd(MQ.R);
                            }

                            currentLineEditor.remove();
                        }
                    }
                }
            },

            upOutOf: function(field){
                const currentLineEditor = element.closest('.line-editor');

                const prevLineEditor = currentLineEditor.previousElementSibling;

                if(prevLineEditor){
                    const prevField = prevLineEditor.querySelector('.editable-field');
                    if(prevField && prevField.mathFieldInstance){
                        prevField.mathFieldInstance.focus();
                        prevField.mathFieldInstance.moveToDirEnd(MQ.R);
                    }
                }
            },

            downOutOf: function(field){
                const currentLineEditor = element.closest('.line-editor');

                const nextLineEditor = currentLineEditor.nextElementSibling;

                if(nextLineEditor){
                    const nextField = nextLineEditor.querySelector('.editable-field');
                    if(nextField && nextField.mathFieldInstance){
                        nextField.mathFieldInstance.focus();
                        nextField.mathFieldInstance.moveToDirEnd(MQ.R);
                    }
                }
            }
        }
    });

    element.mathFieldInstance = mathField;
}

function setupCopyButton(lineEditor){
    const copyButton = lineEditor.querySelector('.copy-button');
    const editorElement = lineEditor.querySelector('.editable-field');

    if(!copyButton || !editorElement) return;

    copyButton.addEventListener('click', function(){
        const targetField = editorElement.mathFieldInstance;
        if(targetField){
            const latexText = targetField.latex();

            navigator.clipboard.writeText(latexText);
        }
    });
}

function createNewLineAndFocus(currentField){
    const newLineEditor = document.createElement('div');
    newLineEditor.className = 'line-editor';

    const newLineNumber = document.createElement('span');
    newLineNumber.className = 'line-number';

    const newEditableField = document.createElement('div');
    newEditableField.className = 'editable-field';

    const newCopyButtonImg = document.createElement('img');
    newCopyButtonImg.src ='./imgs/copy.svg';
    newCopyButtonImg.alt = '数式をコピー';
    newCopyButtonImg.draggable = false;

    const newCopyButton = document.createElement('button');
    newCopyButton.className = 'copy-button';
    newCopyButton.title = '数式をコピー';

    newCopyButton.appendChild(newCopyButtonImg);
    newLineEditor.appendChild(newLineNumber);
    newLineEditor.appendChild(newEditableField);
    newLineEditor.appendChild(newCopyButton);

    const currentLineEditor = currentField.el().closest('.line-editor');
    currentLineEditor.parentNode.insertBefore(newLineEditor, currentLineEditor.nextSibling);

    setupCopyButton(newLineEditor);
    setupMathField(newEditableField);

    newEditableField.mathFieldInstance.focus();
}

// const ribbonContentToolButtons = document.querySelectorAll('.ribbon-content-tool-button');
// const ribbonTabs = document.querySelectorAll('.ribbon-tab');

// リボン
// for (i = 0; i < ribbonTabs.length; i++) {
//     ribbonTabs[i].addEventListener('click', changeTabContent);
// }

// function changeTabContent() {
//     const selectedTab = document.querySelector('.selected');
//     const targetTab = event.target.closest('.ribbon-tab');
//     const targetDataTab = targetTab.getAttribute('data-tab');
//     const showRibbonContent = document.querySelector('.show');
//     const targetRibbonContent = document.getElementById(targetDataTab);

//     selectedTab.classList.remove('selected');
//     targetTab.classList.add('selected');

//     showRibbonContent.classList.remove('show');
//     targetRibbonContent.classList.add('show');
// }

// ribbonContentToolButtons.forEach(ribbonContentToolButton => {
//     const latex = ribbonContentToolButton.getAttribute('data-latex');
//     const MqStaticField = MQ.StaticMath(ribbonContentToolButton);
//     MqStaticField.latex(latex);
//     ribbonContentToolButton.addEventListener('click', insertFormula);
// });

// function insertFormula(e) {
//     let formula = e.target.closest('.ribbon-content-tool-button').getAttribute('data-latex').replace(/⬚/g, '');

//     switch (formula) {
//         case '\\frac{}{}':
//             MqMathEditor.cmd('\\frac');
//             break;
//         case '\\sqrt{}':
//             MqMathEditor.cmd('\\sqrt');
//             break;
//         case '\\sqrt[]{}':
//             MqMathEditor.cmd('\\nthroot');
//             break;
//         case '^':
//             MqMathEditor.cmd('^');
//             break;
//         case '_':
//             MqMathEditor.cmd('_');
//             break;
//         default:
//             MqMathEditor.write(formula);
//     }

//     MqMathEditor.focus();
// }
