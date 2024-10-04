import { Box } from "@mui/material";

export default function Dial({ avgTempOfSite }) {

  const xTranslate = () => {
    let translateAngle = 0;
    const avgTemp = avgTempOfSite();

    if (avgTemp < 39 && avgTemp >= 34) {
      translateAngle = -11;
    } else if (avgTemp >= 39 && avgTemp < 42) {
      translateAngle = -25;
    } else if (avgTemp > 42) {
      translateAngle = -27;
    } else {
      translateAngle = 0;
    }
    return translateAngle;
  };

  const yTranslate = () => {
    let translateAngle = 0;
    const avgTemp = avgTempOfSite();

    if (avgTemp < 39 && avgTemp >= 34) {
      translateAngle = 25;
    } else if (avgTemp >= 39 && avgTemp < 42) {
      translateAngle = 15;
    } else if (avgTemp > 42) {
      translateAngle = -23;
    } else {
      translateAngle = 0;
    }
    return translateAngle;
  };

  const rotationAngle = () => {
    let rotAngle = 0;
    const avgTemp = avgTempOfSite();

    if (avgTemp < 39 && avgTemp >= 34) {
      rotAngle = 60;
    } else if (avgTemp >= 39 && avgTemp < 42) {
      rotAngle = 120;
    } else if (avgTemp > 42) {
      rotAngle = 180;
    } else {
      rotAngle = 0;
    }
    return rotAngle;
  };

  return (
    <Box sx={{ position: "relative" }}>
      <img src="/radial-image.png" alt="Radial background" style={{ position: 'relative' }} />
      <Box
        sx={{
          position: "absolute",
          top: "55%",
          left: "22%",
          transform: `translate(${xTranslate()}%, ${yTranslate()}%) rotate(${rotationAngle()}deg)`,
          transformOrigin: "right center",
        }}
      >
        <img src="/Arrow.png" alt="Temperature arrow" />
      </Box>
    </Box>
  );
}
