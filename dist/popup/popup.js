import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
var Popup = function () {
    return (_jsxs("div", { style: { padding: '10px' }, children: [_jsx("h1", { children: "Extension Popup" }), _jsx("p", { children: "Cliquez trois fois pour d\u00E9clencher le menu contextuel !" })] }));
};
var container = document.getElementById('root');
if (container) {
    var root = ReactDOM.createRoot(container);
    root.render(_jsx(Popup, {}));
}
