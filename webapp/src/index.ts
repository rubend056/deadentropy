import React from "react"
import ReactDOM from "react-dom/client"
import "./index.scss"
import App from "./App"

const el = document.getElementById("root")
if(!el)throw "Root not found"

const root = ReactDOM.createRoot(el)

root.render(React.createElement(App))

