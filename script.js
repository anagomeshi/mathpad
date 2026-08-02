const MQ = MathQuill.getInterface(2);
const MqEditableField = document.getElementById('mq-editable-field');
const MqMathEditor = MQ.MathField(MqEditableField);

const ribbonContentToolButtons = document.querySelectorAll('.ribbon-content-tool-button');
const ribbonTabs = document.querySelectorAll('.ribbon-tab');

const copyButton = document.querySelector('.copy-button');
copyButton.addEventListener('click', copyFormula);

// リボン
for (i = 0; i < ribbonTabs.length; i++) {
    ribbonTabs[i].addEventListener('click', changeTabContent);
}

function changeTabContent() {
    const selectedTab = document.querySelector('.selected');
    const targetTab = event.target.closest('.ribbon-tab');
    const targetDataTab = targetTab.getAttribute('data-tab');
    const showRibbonContent = document.querySelector('.show');
    const targetRibbonContent = document.getElementById(targetDataTab);

    selectedTab.classList.remove('selected');
    targetTab.classList.add('selected');

    showRibbonContent.classList.remove('show');
    targetRibbonContent.classList.add('show');
}

ribbonContentToolButtons.forEach(ribbonContentToolButton => {
    const latex = ribbonContentToolButton.getAttribute('data-latex');
    const MqStaticField = MQ.StaticMath(ribbonContentToolButton);
    MqStaticField.latex(latex);
    ribbonContentToolButton.addEventListener('click', insertFormula);
});

function insertFormula(e) {
    let formula = e.target.closest('.ribbon-content-tool-button').getAttribute('data-latex').replace(/⬚/g, '');

    switch (formula) {
        case '\\frac{}{}':
            MqMathEditor.cmd('\\frac');
            break;
        case '\\sqrt{}':
            MqMathEditor.cmd('\\sqrt');
            break;
        case '\\sqrt[]{}':
            MqMathEditor.cmd('\\nthroot');
            break;
        case '^':
            MqMathEditor.cmd('^');
            break;
        case '_':
            MqMathEditor.cmd('_');
            break;
        default:
            MqMathEditor.write(formula);
    }

    MqMathEditor.focus();
}

// コピー
function copyFormula(){
    const latex = MqMathEditor.latex();
    
    navigator.clipboard.writeText(latex);
}