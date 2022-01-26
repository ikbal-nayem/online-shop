import {
  AutoAwesomeMosaic,
  Build,
  HomeRepairService,
  DashboardCustomize
} from "@mui/icons-material";

import user_type from "util/user_type";


const { HOUSEKEEPER } = user_type

const navLinks = [
  { label: "Dashboard", link: "/dashboard", icon: <AutoAwesomeMosaic /> },
  { label: "House Keeping", link: "/house-keeping", icon: <HomeRepairService />, show_to: [HOUSEKEEPER] },
  {
    label: "Product Config", icon: <DashboardCustomize />,
    children: [
      { label: "Color", link: "/product-config/color" },
      { label: "Size", link: "/product-config/size" },
    ]
  },
  {
    label: "Configuration", link: "/configuration", icon: <Build />,
    children: [
      { label: "User", link: "/configuration/user" },
    ]
  },
];

export default navLinks;