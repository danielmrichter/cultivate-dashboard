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
        <h2>This is the Site Card</h2>
    </Paper>
)
}