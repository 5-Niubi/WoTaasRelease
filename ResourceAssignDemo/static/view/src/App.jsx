// @ts-nocheck
import Spinner from "@atlaskit/spinner";
import { invoke, view } from "@forge/bridge";
import React, { createContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import ErrorModal from "./components/ErrorModal";
import MainPage from "./components/main/MainPage";
import StartUpPage from "./pages/startup/StartUpPage";
import "./pages/style.css";

export const AppContext = createContext();

function App() {
	// Enable auto change theme Dark/light mode within Jira
	view.theme.enable();

	const [history, setHistory] = useState();
	const [historyState, setHistoryState] = useState();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isAuthenticatedLoading, setIsAuthenticatedLoading] = useState(true);

	const [appContextState, setAppContextState] = useState({});
	// Check authenticate every time reload page
	useEffect(function () {
		invoke("getIsAuthenticated").then(function (res) {
			setIsAuthenticatedLoading(false);
			if (res.isAuthenticated) {
				getSubscription();
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}
		});
	}, []);

	function getSubscription() {
		invoke("getCurrentSubscriptionPlan")
			.then(function (res) {
				console.log(res);
				setAppContextState((prev) => ({ ...prev, subscription: res }));
			})
			.catch(() => {});
	}

	// --- Config React Router ---
	useEffect(() => {
		view.createHistory().then((newHistory) => {
			setHistory(newHistory);
		});
	}, []);

	useEffect(() => {
		if (!historyState && history) {
			setHistoryState({
				action: history.action,
				location: history.location,
			});
		}
	}, [history, historyState]);

	useEffect(() => {
		if (history) {
			history.listen((location, action) => {
				setHistoryState({
					action,
					location,
				});
			});
		}
	}, [history]);
	// --- / ---
	return (
		<>
			{history && historyState && !isAuthenticatedLoading ? (
				<>
					{isAuthenticated ? (
						<AppContext.Provider
							value={{ appContextState, setAppContextState }}
						>
							<MainPage history={history} historyState={historyState} />
						</AppContext.Provider>
					) : (
						<StartUpPage />
					)}
					{appContextState.error && (
						<ErrorModal setState={setAppContextState}>
							{appContextState.error}
						</ErrorModal>
					)}
				</>
			) : (
				<Spinner interactionName="load" size={"large"} />
			)}
			<ToastContainer />
		</>
	);
}

export default App;
