import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./component/App";
import Footer from "./component/Footer";

ReactDOM.render(
	<React.StrictMode>
		<div className="app-container">
			<App />
		</div>
		<Footer />
	</React.StrictMode>,
	document.getElementById("root")
);
