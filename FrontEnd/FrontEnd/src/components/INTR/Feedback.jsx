import React, { useState } from "react";
import FormfacadeEmbed from "@formfacade/embed-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Feedback = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleBack = () => {
    // Reset the submission status to show the form again
    setIsSubmitted(false);
    setShowModal(false); // Close the modal
  };

  return (
    <div className="container mt-4">
      <h2>Syllabus Checker Feedback Form and Queries</h2>

      {/* Feedback Form */}
      {!isSubmitted ? (
        <FormfacadeEmbed
          formFacadeURL="https://formfacade.com/include/105406944749420818703/form/1FAIpQLSe8i5Gmms1aFxaDQnsfdCrmU_eZ4GKMTo9pCe2IKKkQ9yPOJw/classic.js/?div=ff-compose"
          onSubmitForm={() => {
            console.log("Form submitted");
            setIsSubmitted(true); // Update the submission status
            setShowModal(true); // Show the submission modal
          }}
        />
      ) : null}

      {/* Submission Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Submission Successful</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleBack}
                ></button>
              </div>
              <div className="modal-body text-center">
                <h3>Thank you for your feedback!</h3>
                <p className="text-muted">
                  Your feedback has been submitted successfully.
                </p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={handleBack}
                >
                  Back to Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
