import ButtonGroup from "@atlaskit/button/button-group";
import Button from "@atlaskit/button/standard-button";
import __noop from "@atlaskit/ds-lib/noop";
import PageHeader from "@atlaskit/page-header";
import { useState } from "react";
import EstimateModal from "./modal/EstimateModal";

const VisualizePageHeader = ({title}) => {
	const [isOpenEstimateModal, setOpenEstimateModal] = useState(false);

	const updateOpenEstimateModal = (isOpen) => {
		setOpenEstimateModal(isOpen);
	};

	function openEstimateModal() {
		setOpenEstimateModal(true);
	}

	const actionsContent = (
		<ButtonGroup>
			<Button appearance="primary" onClick={openEstimateModal}>
				Estimate
			</Button>
		</ButtonGroup>
	);

	return (
		<PageHeader actions={actionsContent}>
			{title}
			<EstimateModal isOpen={isOpenEstimateModal} updateOpenEstimateModal={updateOpenEstimateModal}/>
		</PageHeader>
	);
};

export default VisualizePageHeader;
