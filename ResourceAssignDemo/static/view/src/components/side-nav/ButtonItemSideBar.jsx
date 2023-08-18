import { ButtonItem } from "@atlaskit/side-navigation";
import React from "react";
import {
	useLocation,
	useNavigate,
	matchRoutes,
} from "react-router";

const useCurrentPath = (pathMatch) => {
	const routes = [{ path: pathMatch }];
	const location = useLocation();
	const routesMatch = matchRoutes(routes, location);
	if (routesMatch) {
		return routesMatch[0].route.path === pathMatch;
	}
	return false;
};

function ButtonItemSideBar({ rootPath, pathTo, text, iconBefore }) {
	const navigate = useNavigate();
	const isMatchPath = useCurrentPath(rootPath + pathTo);
	return (
		<ButtonItem
			isSelected={isMatchPath}
			iconBefore={iconBefore}
			onClick={() => {
				navigate(pathTo);
			}}
		>
			{text}
		</ButtonItem>
	);
}

export default ButtonItemSideBar;
