import { Box, useTheme } from "@mui/material";

export default function MiniAlert (props) {
    let alert = props.alert;
    const theme = useTheme();

    const fillColor = () => {
        let newFill = '';
        if (alert.temperature >= 42) {
            newFill = theme.palette.error.light;
        } else if (alert.temperature < 42 && alert.temperature >= 39) {
            newFill = theme.palette.warning.light;
        }
        return newFill;
    }
    return (
        <Box sx={{backgroundColor: fillColor(), px: 2, py: 1, my:1, borderRadius: 5, width:"250px"}}>
            <div>
            <b>{alert.temperature}&deg;F</b> {alert.piler_name} 
            </div>
            <div>
            {alert.temperature_time}
            </div>
        </Box>
    )
}