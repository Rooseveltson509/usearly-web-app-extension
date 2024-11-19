import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var FloatingMenu = function (_a) {
    var x = _a.x, y = _a.y, onCommentClick = _a.onCommentClick, onCaptureClick = _a.onCaptureClick;
    return (_jsxs("div", { style: {
            position: 'absolute',
            top: y,
            left: x,
            backgroundColor: '#ffffff',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
        }, children: [_jsx("button", { onClick: onCommentClick, "aria-label": "Commenter", children: "\uD83D\uDCAC Commenter" }), _jsx("button", { onClick: onCaptureClick, "aria-label": "Capturer", children: "\uD83D\uDCF8 Capturer" })] }));
};
export default FloatingMenu;
