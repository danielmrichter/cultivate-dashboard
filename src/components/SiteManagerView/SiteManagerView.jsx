import { Box, Paper } from "@mui/material";
import SiteCard from "../CardComponents/SiteCard";
import PilerCard from "../CardComponents/PilerCard";


const sampleData = {
    site_id: 1,
    site_name: 'Concord',
    pilers: [
        {
            piler_id: 1,
            piler_name: 'Piler 1',
            dayActuals: [
                { beet_data_id: 101, temperature: 36.54634, time: '2024-09-01 00:00:00' },
                { beet_data_id: 102, temperature: 38.22456, time: '2024-09-01 06:00:00' },
                { beet_data_id: 103, temperature: 40.153456, time: '2024-09-01 12:00:00' },
                { beet_data_id: 104, temperature: 42.773456, time: '2024-09-01 18:00:00' },
                { beet_data_id: 105, temperature: 35.93345, time: '2024-09-01 23:59:59' },
            ],
            monthAvgDaily: [
                { day: '2024-09-01', avgTempOfEachDay: 38.683456 },
                { day: '2024-09-02', avgTempOfEachDay: 41.123456 },
                { day: '2024-09-03', avgTempOfEachDay: 39.45345 },
                { day: '2024-09-04', avgTempOfEachDay: 42.31345 },
                { day: '2024-09-05', avgTempOfEachDay: 43.54345 }
            ]
        },
        {
            piler_id: 2,
            piler_name: 'Piler 2',
            dayActuals: [
                { beet_data_id: 201, temperature: 39.023456, time: '2024-09-01 00:00:00' },
                { beet_data_id: 202, temperature: 41.545678, time: '2024-09-01 06:00:00' },
                { beet_data_id: 203, temperature: 43.855678, time: '2024-09-01 12:00:00' },
                { beet_data_id: 204, temperature: 44.66765, time: '2024-09-01 18:00:00' },
                { beet_data_id: 205, temperature: 37.1454, time: '2024-09-01 23:59:59' },
            ],
            monthAvgDaily: [
                { day: '2024-09-01', avgTempOfEachDay: 41.24456 },
                { day: '2024-09-02', avgTempOfEachDay: 42.86456 },
                { day: '2024-09-03', avgTempOfEachDay: 40.97456 },
                { day: '2024-09-04', avgTempOfEachDay: 39.73764 },
                { day: '2024-09-05', avgTempOfEachDay: 43.137654 }
            ]
        },
        {
            piler_id: 3,
            piler_name: 'Piler 3',
            dayActuals: [
                { beet_data_id: 301, temperature: 36.74765, time: '2024-09-01 00:00:00' },
                { beet_data_id: 302, temperature: 38.927654, time: '2024-09-01 06:00:00' },
                { beet_data_id: 303, temperature: 40.387654, time: '2024-09-01 12:00:00' },
                { beet_data_id: 304, temperature: 45.09765, time: '2024-09-01 18:00:00' },
                { beet_data_id: 305, temperature: 46.56465, time: '2024-09-01 23:59:59' },
            ],
            monthAvgDaily: [
                { day: '2024-09-01', avgTempOfEachDay: 41.48456 },
                { day: '2024-09-02', avgTempOfEachDay: 39.057654 },
                { day: '2024-09-03', avgTempOfEachDay: 44.257564 },
                { day: '2024-09-04', avgTempOfEachDay: 42.777654 },
                { day: '2024-09-05', avgTempOfEachDay: 43.98745 }
            ]
        }
    ]
}

export default function SiteManagerView () {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          flex: 1,
        }}
      >
        {sampleData.pilers.map((piler) => (
          <PilerCard key={piler.piler_id} data={piler} />
        ))}
      </Box>
      <Box sx={{ flex: '0 1 250px', marginLeft: 2 }}>
        <SiteCard />
      </Box>
    </Box>
  );
}
