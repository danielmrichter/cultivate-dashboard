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
                { beet_data_id: 101, temperature: 36.5, time: '2024-09-01 00:00:00' },
                { beet_data_id: 102, temperature: 38.2, time: '2024-09-01 06:00:00' },
                { beet_data_id: 103, temperature: 40.1, time: '2024-09-01 12:00:00' },
                { beet_data_id: 104, temperature: 42.7, time: '2024-09-01 18:00:00' },
                { beet_data_id: 105, temperature: 35.9, time: '2024-09-01 23:59:59' },
            ],
            monthAvgDaily: [
                { day: '2024-09-01', avgTempOfEachDay: 38.68 },
                { day: '2024-09-02', avgTempOfEachDay: 41.12 },
                { day: '2024-09-03', avgTempOfEachDay: 39.45 },
                { day: '2024-09-04', avgTempOfEachDay: 42.31 },
                { day: '2024-09-05', avgTempOfEachDay: 43.5 }
            ]
        },
        {
            piler_id: 2,
            piler_name: 'Piler 2',
            dayActuals: [
                { beet_data_id: 201, temperature: 39.0, time: '2024-09-01 00:00:00' },
                { beet_data_id: 202, temperature: 41.5, time: '2024-09-01 06:00:00' },
                { beet_data_id: 203, temperature: 43.8, time: '2024-09-01 12:00:00' },
                { beet_data_id: 204, temperature: 44.6, time: '2024-09-01 18:00:00' },
                { beet_data_id: 205, temperature: 37.1, time: '2024-09-01 23:59:59' },
            ],
            monthAvgDaily: [
                { day: '2024-09-01', avgTempOfEachDay: 41.2 },
                { day: '2024-09-02', avgTempOfEachDay: 42.8 },
                { day: '2024-09-03', avgTempOfEachDay: 40.9 },
                { day: '2024-09-04', avgTempOfEachDay: 39.7 },
                { day: '2024-09-05', avgTempOfEachDay: 43.1 }
            ]
        },
        {
            piler_id: 3,
            piler_name: 'Piler 3',
            dayActuals: [
                { beet_data_id: 301, temperature: 36.7, time: '2024-09-01 00:00:00' },
                { beet_data_id: 302, temperature: 38.9, time: '2024-09-01 06:00:00' },
                { beet_data_id: 303, temperature: 40.3, time: '2024-09-01 12:00:00' },
                { beet_data_id: 304, temperature: 45.0, time: '2024-09-01 18:00:00' },
                { beet_data_id: 305, temperature: 46.5, time: '2024-09-01 23:59:59' },
            ],
            monthAvgDaily: [
                { day: '2024-09-01', avgTempOfEachDay: 41.48 },
                { day: '2024-09-02', avgTempOfEachDay: 39.0 },
                { day: '2024-09-03', avgTempOfEachDay: 44.2 },
                { day: '2024-09-04', avgTempOfEachDay: 42.7 },
                { day: '2024-09-05', avgTempOfEachDay: 43.9 }
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
