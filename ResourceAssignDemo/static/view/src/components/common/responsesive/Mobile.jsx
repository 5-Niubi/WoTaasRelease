import { useMediaQuery } from "react-responsive";
import { MEDIA_QUERY } from "../../../common/contants";

const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: MEDIA_QUERY.MOBILE.MAX });
  return isMobile ? children : null;
};

export default Mobile;