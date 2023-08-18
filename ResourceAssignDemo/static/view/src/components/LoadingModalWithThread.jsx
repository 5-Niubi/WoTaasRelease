import Image from "@atlaskit/image";
import Modal, {
	ModalBody,
	ModalFooter,
	ModalTransition,
} from "@atlaskit/modal-dialog";
import ProgressBar from "@atlaskit/progress-bar";
import { invoke } from "@forge/bridge";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import SnakeLink from "../assets/images/wired-flat-1213-snake.gif";
import ProcessImg from "../assets/images/wired-flat-1325-code-fork.gif";
import Toastify from "../common/Toastify";
import {
	INTERVAL_FETCH,
	RETRY_TIMES,
	THREAD_ACTION,
	THREAD_STATUS,
} from "../common/contants";
import { HttpStatus } from "../common/httpStatus";
import {
	extractErrorMessage,
	isArrayEmpty,
	isObjectEmpty,
	removeThreadInfo,
} from "../common/utils";

let retryNumber = RETRY_TIMES;
function LoadingModalWithThread({ state }) {
	const [modalState, setModalState] = state;
	const { setAppContextState } = useContext(AppContext);
	const closeModal = function () {
		setModalState((prev) => ({ ...prev, threadId: null }));
		removeThreadInfo();
	};
	const [progress, setProgress] = useState("");

	// --- Handle Loading
	function checkingThread() {
		invoke("getThreadResult", { threadId: modalState.threadId })
			.then((res) => {
				retryNumber = RETRY_TIMES;
				handleThreadSuccess(res);
			})
			.catch((error) => {
				let errorMsg = extractErrorMessage(error);
				if (errorMsg.status === HttpStatus.NOT_FOUND.code) {
					// Toastify.error(errorMsg.statusText);
					closeModal();
				} else {
					Toastify.error(errorMsg.message);
				}
				if (--retryNumber === 0) {
					closeModal();
				}
			});
	}
	useEffect(() => {
		checkingThread();
		//assign interval to a variable to clear it.
		const intervalId = setInterval(() => {
			checkingThread();
		}, INTERVAL_FETCH);

		return () => clearInterval(intervalId); //This is important
	}, []);

	const handleThreadSuccess = useCallback((res) => {
		console.log(res);

		// Export thread success
		switch (res.status) {
			case THREAD_STATUS.RUNNING:
				setProgress(res.progress);
				break;
			case THREAD_STATUS.SUCCESS:
				// Specific action in here
				if (modalState.threadAction === THREAD_ACTION.JIRA_EXPORT) {
					Toastify.success(
						`Export successfully: ${res.result.projectName} was created`
					);
				}
				//define action running scheduling success
				if (modalState.threadAction === THREAD_ACTION.RUNNING_SCHEDULE) {
					modalState.callBack();
				}
				// Handle finish thread

				closeModal();
				break;
			case THREAD_STATUS.ERROR:
				if (modalState.threadAction === THREAD_ACTION.JIRA_EXPORT) {
					let message, response, errorMessages, errors;
					message = res.result.message;

					if (res.result.response) {
						response = JSON.parse(res.result.response);
						errorMessages = response.errorMessages;
						errors = response.errors;
					}
					// setErrorMsg(JSON.stringify(JSON.parse(res.result.response).errors));

					const errorBody = (
						<div>
							{message && (
								<div>
									<h4>{message}</h4>
								</div>
							)}

							{!isArrayEmpty(errorMessages) && (
								<div>
									Messages Error:
									<ul>
										{errorMessages.map((e, index) => (
											<li key={index}>{e}</li>
										))}
									</ul>
								</div>
							)}
							{!isObjectEmpty(errors) && (
								<div>
									Errors:
									{JSON.stringify(errors)};
								</div>
							)}
						</div>
					);
					setAppContextState((prev) => ({ ...prev, error: errorBody }));
				}

				if (modalState.threadAction === THREAD_ACTION.RUNNING_SCHEDULE) {
					Toastify.error(
						"Error at thread of Running Schedule: " + JSON.stringify(res.result)
					);
				}

				// Handle finish thread
				closeModal();
				break;
		}
	}, []);
	// ----------------

	let animation;
	if (modalState.threadAction === THREAD_ACTION.JIRA_EXPORT) {
		animation = <Image style={{width: "5em"}} src={SnakeLink} />;
	} else if (modalState.threadAction === THREAD_ACTION.RUNNING_SCHEDULE) {
		animation = <Image style={{width: "5em"}} src={ProcessImg} />;
	}
	return (
		<ModalTransition>
			<Modal>
				<ModalBody>
					<div
						style={{
							height: "5em",
							marginTop: "1em",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<p style={{ fontSize: "18px" }}>
							This process will take some minutes...
						</p>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{animation}
					</div>
					<div
						style={{
							marginBottom: "20px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{progress && progress.length !== 0 && (
							<p style={{ fontSize: "16px" }}>({progress})</p>
						)}
					</div>
					<ProgressBar ariaLabel="Loading" isIndeterminate></ProgressBar>
				</ModalBody>
				<ModalFooter></ModalFooter>
			</Modal>
		</ModalTransition>
	);
}

export default LoadingModalWithThread;
