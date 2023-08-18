import { useMediaQuery } from "react-responsive";
import { MEDIA_QUERY } from "../../../common/contants";

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: MEDIA_QUERY.DESKTOP_LAPTOP.MIN });
  return isDesktop ? children : null;
};

export default Desktop;
