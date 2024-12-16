import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuthStore } from "../../store/authStore";
import { useSession, useSupabaseClient, useSessionContext } from "@supabase/auth-helpers-react";

const CCalendar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();
  const navigate = useNavigate();

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Sign in with Google
  const googleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
        redirectTo: "http://localhost:5173/CITL/Calendar",
      },
    });

    if (error) {
      alert("Google Sign-In Error");
      console.error("Google Sign-In Error:", error);
    }
  };

  // Handle event creation click
  const handleCreateEventClick = async () => {
    if (!session?.provider_token) {
      alert("You need to sign in with Google first.");
      await googleSignIn();

      if (!session?.provider_token) {
        return; // If still not signed in, stop the process
      }
    }

    setIsModalOpen(true);
  };

  // Create a calendar event
  const createCalendarEvent = async () => {
    if (!session?.provider_token) {
      alert("Please sign in with Google first.");
      return;
    }

    const event = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + session.provider_token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      const result = await response.json();
      console.log(result);

      alert("Event successfully created. Check your Google Calendar!");

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create an event.");
    }
  };

  return (
    <div className="container py-4 bg-light">
      {/* Button to open modal */}
      <button onClick={handleCreateEventClick} className="btn btn-primary mb-3">
        Create Event
      </button>

      {/* Modal for Event Creation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-4 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <button onClick={toggleModal} className="btn btn-link text-danger">
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div>
              <label>Start Time</label>
              <DatePicker
                selected={start}
                onChange={(date) => setStart(date)}
                showTimeInput
                className="form-control mt-2"
                dateFormat="Pp"
              />

              <label className="mt-3">End Time</label>
              <DatePicker
                selected={end}
                onChange={(date) => setEnd(date)}
                showTimeInput
                className="form-control mt-2"
                dateFormat="Pp"
              />

              <label className="mt-3">Event Name</label>
              <input
                type="text"
                placeholder="Event name"
                className="form-control mt-2"
                onChange={(e) => setEventName(e.target.value)}
              />

              <label className="mt-3">Event Description</label>
              <textarea
                placeholder="Event description"
                className="form-control mt-2"
                rows="4"
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </div>

            {/* Modal Footer Buttons */}
            <div className="mt-4 flex justify-end">
              <button onClick={toggleModal} className="btn btn-secondary mx-2">
                Cancel
              </button>

              <button onClick={createCalendarEvent} className="btn btn-primary">
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Calendar iframe */}
      <iframe
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=UTC&showPrint=0&title=To-do&src=MjIwMTEwMjg0M0BzdHVkZW50LmJ1a3N1LmVkdS5waA&src=ZW4ucGhpbGlwcGluZXMjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%230B8043&color=%230B8043"
        className="border rounded shadow mt-4"
        style={{ width: "100%", height: "700px" }}
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
};

export default CCalendar;
