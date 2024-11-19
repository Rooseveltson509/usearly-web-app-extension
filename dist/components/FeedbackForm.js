import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
var FeedbackForm = function (_a) {
    var screenshot = _a.screenshot, onClose = _a.onClose;
    var _b = useState(''), comment = _b[0], setComment = _b[1];
    var _c = useState('😐'), sentiment = _c[0], setSentiment = _c[1];
    // Fonction pour obtenir le titre en fonction du sentiment
    var getTitle = function () {
        switch (sentiment) {
            case '😐':
                return "Qu'est-ce qui pourrait être amélioré ?";
            case '😤':
                return "Qu'est-ce qui vous agace ?";
            case '😡':
                return "Qu'est-ce qui vous met en colère ?";
            default:
                return "Donnez votre avis";
        }
    };
    return (_jsxs("div", { style: { padding: '20px', backgroundColor: '#fff', borderRadius: '8px', position: 'fixed', top: '10%', left: '10%', zIndex: 10000, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }, children: [_jsx("h2", { children: getTitle() }), _jsx("img", { src: screenshot, alt: "Capture", style: { width: '100%', maxHeight: '200px', marginBottom: '10px' } }), _jsx("textarea", { placeholder: "D\u00E9crivez votre probl\u00E8me...", value: comment, onChange: function (e) { return setComment(e.target.value); }, style: { width: '100%', height: '80px', marginBottom: '10px' } }), _jsxs("div", { children: [_jsx("label", { children: "Votre sentiment : " }), _jsx("button", { onClick: function () { return setSentiment('😐'); }, children: "\uD83D\uDE10" }), _jsx("button", { onClick: function () { return setSentiment('😤'); }, children: "\uD83D\uDE24" }), _jsx("button", { onClick: function () { return setSentiment('😡'); }, children: "\uD83D\uDE21" })] }), _jsx("button", { type: "button", onClick: onClose, style: { marginTop: '10px' }, children: "Envoyer" })] }));
};
export default FeedbackForm;
