const MQ = MathQuill.getInterface(2);

// DOMのロードが完了したら、htmlにべた書きされてる行に対して初期化処理を行う
document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.editable-field').forEach(function(editorElement) {
        setupMathField(editorElement);
        setupCopyButton(editorElement.closest('.line-editor'));
    });
});

// 数式入力部（editable-field）のセットアップ ハンドラの詳述↓
// enter：エンター入力で新行作成、フォーカス移動
// deleteOutOf：空行でのバックスペース入力で現在の行削除、下に行があれば下の行へ、なければ上の行へフォーカス移動
// upOutOf, downOutOf：上/下矢印キーでフォーカス移動
function setupMathField(element){
    const mathField = MQ.MathField(element, {
        handlers: {
            enter: function(field){
                if(field.latex() === "") return;
                createNewLineAndFocus(field);
            },

            deleteOutOf: function(dir, field){
                if(dir === MQ.L && field.latex() === ""){
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
                    }

                    else if(nextLineEditor){
                        const nextField = nextLineEditor.querySelector('.editable-field');
                        if(nextField && nextField.mathFieldInstance){
                            nextField.mathFieldInstance.focus();
                            nextField.mathFieldInstance.moveToDirEnd(MQ.R);
                        }

                        currentLineEditor.remove();
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

    const hiddenTextArea = element.querySelector('textarea');
    if(hiddenTextArea){
        if(isMobileDevice()){
            hiddenTextArea.setAttribute('inputmode', 'none');
        }else{
            hiddenTextArea.setAttribute('inputmode', 'text');
        }
    }
}

// 各コピーボタンに対して対象となるeditable-fieldを紐づけする
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

// 現在の行の下へ新行を作成
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

// 現在フォーカス中の行を取得
function getFocusedMathField(){
    const focusedLine = document.querySelector('.line-editor:focus-within');

    if(focusedLine){
        const editorElement = focusedLine.querySelector('.editable-field');
        return editorElement ? editorElement.mathFieldInstance : null;
    }
    return null;
}

// ユーザーの使用デバイスの種類をチェック
function isMobileDevice(){
    return /Mobi|Android|iPhone|iPad|Macintosh/i.test(navigator.userAgent) && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

// 仮想キーボード
document.querySelector('.keyboard').addEventListener('pointerdown', function(e){
    e.preventDefault();
});

document.querySelectorAll('.switcher-tab').forEach(function(tab){
    tab.addEventListener('pointerdown', function(e){
        e.preventDefault();
        
        const dataTab = tab.getAttribute('data-tab');

        const selectedTab = document.querySelector('.selected');
        const showedKeyboardPanel = document.querySelector('.showed');
        const targetKeyboardPanel = document.querySelector(`[data-panel=${dataTab}]`);

        selectedTab.classList.remove('selected');
        tab.classList.add('selected');

        showedKeyboardPanel.classList.remove('showed');
        targetKeyboardPanel.classList.add('showed');
    });
});

document.querySelectorAll('.keyboard-button').forEach(function(btn){
    if(btn.classList.contains('font-input')){
        const text = btn.getAttribute('data-value');

        btn.textContent = text;
    }

    else if(btn.classList.contains('cmd-input')){
        const latexText = btn.getAttribute('data-cmd');

        const MqStaticField = MQ.StaticMath(btn);
        MqStaticField.latex(latexText);
    }

    else if(btn.classList.contains('symbol-input')){
        const latexText = btn.getAttribute('data-symbol');

        const MqStaticField = MQ.StaticMath(btn);
        MqStaticField.latex(latexText);
    }

    btn.addEventListener('pointerdown', function(e){
        e.preventDefault();

        const focusedLine = getFocusedMathField();
        if(!focusedLine) return;

        if(btn.classList.contains('font-input')){
            const val = btn.getAttribute('data-value');
            focusedLine.typedText(val);
        }

        else if(btn.classList.contains('cmd-input')){
            const cmd = btn.getAttribute('data-cmd').replace(/⬚/g, '');

            switch(cmd){
                case '\\frac{}{}':
                    focusedLine.cmd('\\frac');
                    break;
                case '\\sqrt{}':
                    focusedLine.cmd('\\sqrt');
                    break;
                case '\\sqrt[]{}':
                    focusedLine.cmd('\\nthroot');
                    break;
                case '^':
                    focusedLine.cmd('^');
                    break;
                case '_':
                    focusedLine.cmd('_');
                    break;
                case '||':
                    focusedLine.cmd('|');
                    break;
                case '\\Sigma':
                    focusedLine.cmd('\\sum');
                    break;
                case '\\Pi':
                    focusedLine.cmd('\\prod');
                    break;
                case '\\vec{}':
                    focusedLine.cmd('\\vec');
                    break;
                case '\\overline{}':
                    focusedLine.cmd('\\overline');
                    break;
                case '\\underline{}':
                    focusedLine.cmd('\\underline');
                    break;
                case '\\binom{}{}':
                    focusedLine.cmd('\\binom');
                    break;
                default:
                    focusedLine.write(cmd);
            }
        }

        else if(btn.classList.contains('symbol-input')){
            const symbol = btn.getAttribute('data-symbol');
            focusedLine.write(symbol);
        }

        else if(btn.classList.contains('stroke-input')){
            const key = btn.getAttribute('data-key');

            if(key === 'Enter'){
                const editorElement = document.querySelector('.line-editor:focus-within .editable-field');
                const isTypingLatex = editorElement ? editorElement.querySelector('.mq-latex-command-input') !== null : false;

                if(isTypingLatex){
                    focusedLine.keystroke('Enter');
                }else{
                    if(focusedLine.latex() !== "") createNewLineAndFocus(focusedLine);
                }
            }
            else{
                focusedLine.keystroke(key);
            }
        }
    });

    // Safariのダブルタップ拡大を防ぐ
    btn.addEventListener('touchend', function(e){
        e.preventDefault();
    }, { passive: false });
});
