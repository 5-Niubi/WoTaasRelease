import { useMediaQuery } from "react-responsive";
import { MEDIA_QUERY } from "../../../common/contants";

const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({
    minWidth: MEDIA_QUERY.TABLET.MIN,
    maxWidth: MEDIA_QUERY.TABLET.MAX,
  });
  return isTablet ? children : null;
};

export default Tablet;
