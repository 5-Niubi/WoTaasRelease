import { Section, NestingItem, ButtonItem } from "@atlaskit/side-navigation";
import Spinner from "@atlaskit/spinner";
import React, { useCallback, useState } from "react";
import SignOutIcon from "@atlaskit/icon/glyph/sign-out";
import InfoIcon from "@atlaskit/icon/glyph/info";
import MoreIcon from "@atlaskit/icon/glyph/more";
import { invoke, router } from "@forge/bridge";

import ButtonItemSideBar from "./ButtonItemSideBar";

function MoreSection({ rootPath }) {
	const [signOutLoading, setSignOutLoading] = useState(false);

	const handleSignout = useCallback(function () {
		setSignOutLoading(true);
		invoke("signout")
			.then(function (res) {
				router.reload();
			})
			.catch(function (error) {
				console.log(error);
			});
	}, []);

	return (
		<NestingItem id="2" title="More" iconBefore={<MoreIcon label="" />}>
			<Section>
				<ButtonItemSideBar
					rootPath={rootPath}
					text={"Subscription info"}
					pathTo={"subscription"}
					iconBefore={<InfoIcon label="" />}
				/>
			</Section>
			<Section title="System">
				<ButtonItem
					iconBefore={<SignOutIcon label="signout" />}
					onClick={handleSignout}
					iconAfter={signOutLoading && <Spinner size={"medium"} />}
					isDisabled={signOutLoading}
				>
					Re-grant access
				</ButtonItem>
			</Section>
		</NestingItem>
	);
}

export default MoreSection;
