const MQ = MathQuill.getInterface(2);
const MqEditableField = document.getElementById('mq-editable-field');
const RibbonContentToolButtons = document.querySelectorAll('.ribbon-content-tool-button');
const MqMathEditor = MQ.MathField(MqEditableField);

RibbonContentToolButtons.forEach(RibbonContentToolButton => {
    const latex = RibbonContentToolButton.getAttribute('data-latex');
    const MqStaticField = MQ.StaticMath(RibbonContentToolButton);
    MqStaticField.latex(latex);
    RibbonContentToolButton.addEventListener('click', insertFormula);
});

function insertFormula(e) {
    let formula = e.target.closest('.ribbon-content-tool-button').getAttribute('data-latex').replace(/⬚/g, '');

    switch(formula){
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
