import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import CCalendar from "./components/CITL/CCalendar.jsx";

// Supabase Client setup
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const supabase = createClient(
  "https://brmjlwcvnjqrwzhcdfmm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybWpsd2N2bmpxcnd6aGNkZm1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwNDUwMzksImV4cCI6MjA0OTYyMTAzOX0.Q5qYhf-PJh6dyiHPyvtES33B-k4QCDM9xSsbv8tWVzU" 
);



ReactDOM.createRoot(document.getElementById("root")).render(
	
	<React.StrictMode>
		<SessionContextProvider supabaseClient={supabase}>	
		<BrowserRouter>
			<App />
		</BrowserRouter>
		</SessionContextProvider>
	</React.StrictMode>
);