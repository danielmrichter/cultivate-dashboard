import { Paper } from "@mui/material";

export default function SiteCard (props) {
return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "300px",
        padding: "16px",
        gap: "16px"
      }}
    >
        <h2>Average Temp at Site</h2>
        <img src="/radial-image.png" ></img>
        <h3>36&deg;F</h3>
    </Paper>
)
}