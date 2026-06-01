import React, { useState } from 'react';
import {
  Container,
  Typography,
  ThemeProvider,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { CardProvider } from './context/CardContext';
import CardCreator from './components/CardCreator';
import CardGallery from './components/CardGallery';
import PrintableCard from './components/PrintableCard';
import PrintFormatter from './components/PrintFormatter';
import theme from './theme';
import './styles/print.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      aria-hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CardProvider>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Football Card Creator
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="card management tabs"
            >
              <Tab label="Create Card" />
              <Tab label="My Cards" />
              <Tab label="Print Preview" />
              <Tab label="Print Cards" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <CardCreator onNavigateToGallery={() => setTabValue(1)} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <CardGallery
              onEditCard={() => setTabValue(0)}
              onCreateNew={() => setTabValue(0)}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <PrintableCard />
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <PrintFormatter onNavigateToGallery={() => setTabValue(1)} />
          </TabPanel>
        </Container>
      </CardProvider>
    </ThemeProvider>
  );
}

export default App;
