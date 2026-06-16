namespace MedConnect.Backend.DTOs;

public record UpdatePatientDto(
    Guid Id,
    string Name,
    string Lastname,
    string Pesel,
    int? HeartRate = null,
    int? SystolicBloodPressure = null,
    string? Symptoms = null
);