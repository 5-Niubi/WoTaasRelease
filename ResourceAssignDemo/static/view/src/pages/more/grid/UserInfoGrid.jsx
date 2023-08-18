import Button from "@atlaskit/button";
import { Grid, GridColumn } from "@atlaskit/page";
import { Box } from "@atlaskit/primitives";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../App";
import "../styles.css";
import { extractErrorMessage, formatDateDMY } from "../../../common/utils";
import Spinner from "@atlaskit/spinner";
import { router, view } from "@forge/bridge";
import { DOMAIN_SUBSCRIPTION_SERVER, SUBSCRIPTION } from "../../../common/contants";
import Toastify from "../../../common/Toastify";

const columns = 12;
function UserInfoGrid() {
	const {appContextState} = useContext(AppContext);
	let subscription = appContextState.subscription;

	const [context, setContext] = useState({});

	useEffect(() => {
		view
			.getContext()
			.then((res) => {
				setContext(res);
			})
			.catch((err) => {
				let errString = extractErrorMessage(err);
				Toastify.error(errString);
			});
	}, []);

	function handleChangePlanClick() {
		router.open(`${DOMAIN_SUBSCRIPTION_SERVER}/Upgrade?token=${subscription.token}`);
	}

	return subscription ? (
		<>
			<Grid spacing="compact" columns={columns}>
				<GridColumn medium={10}>
					<Grid spacing="comfortable" columns={columns}>
						<GridColumn medium={columns}>
							<h1 className="" style={{ marginBottom: "1em" }}>
								Subscription Information
							</h1>
						</GridColumn>
					</Grid>
					<hr />
					<Grid spacing="compact" columns={columns}>
						<GridColumn medium={5}>
							<h3 className="user-info-title">Your site</h3>
						</GridColumn>
						<GridColumn medium={7}>
							<p className="user-info-detail">{context.siteUrl}</p>
						</GridColumn>

						<GridColumn medium={5}>
							<h3 className="user-info-title">User Token</h3>
						</GridColumn>

						<GridColumn medium={7}>
							<p className="user-info-detail">{subscription.token}</p>
						</GridColumn>
						<GridColumn medium={5}>
							<h3 className="user-info-title">Current Plan</h3>
						</GridColumn>
						<GridColumn medium={7}>
							<p className="user-info-detail">{subscription.plan.name}</p>
						</GridColumn>
						<GridColumn medium={5}>
							<h3 className="user-info-title">Start Date</h3>
						</GridColumn>
						<GridColumn medium={7}>
							<p className="user-info-detail">
								{formatDateDMY(subscription.currentPeriodStart)}
							</p>
						</GridColumn>
						<GridColumn medium={5}>
							<h3 className="user-info-title">End Date</h3>
						</GridColumn>
						<GridColumn medium={7}>
							<p className="user-info-detail">
								{subscription.currentPeriodEnd
									? formatDateDMY(subscription.currentPeriodEnd)
									: "∞ Unlimited"}
							</p>
						</GridColumn>
					</Grid>
				</GridColumn>
			</Grid>
			<Grid spacing="compact" columns={columns}>
				<Button
					appearance="primary"
					onClick={handleChangePlanClick}
					isDisabled={subscription.plan.id != SUBSCRIPTION.FREE_ID}
				>
					Change Plan
				</Button>
			</Grid>
		</>
	) : (
		<Spinner size={"large"} />
	);
}

export default UserInfoGrid;
