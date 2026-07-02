namespace MedConnect.Backend.Models;

public record InterviewDto
(
    Guid PatientId,
    bool ChestPain,
    bool Dyspnea,
    bool AbdominalPain,
    bool Headache,
    bool Cough,
    bool Hypertension,
    bool Diabetes
);