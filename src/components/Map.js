import ReactMap from "react-mapbox-gl";

const accessToken =
  "pk.eyJ1IjoiYWxleDMxNjUiLCJhIjoiY2o0MHp2cGtiMGFrajMycG5nbzBuY2pjaiJ9.QDApU0XH2v35viSwQuln5w";

export const style = "mapbox://styles/mapbox/streets-v9";

export const Map = ReactMap({
  accessToken
});

export const mapStyle = {
  height: "500px",
  width: "100%"
};
